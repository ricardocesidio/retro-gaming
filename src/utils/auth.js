import { isBrowser, safeJsonParse as safeParse } from "./shared.js";
import { normalizeId } from "./normalizeProduct.js";

const REGISTRY_KEY = "registeredUsers";
const LEGACY_REGISTRY_KEY = "registeredUser";

const normalizeUser = (user = {}) => {
  const username = String(user.username ?? user.name ?? "").trim();
  const email = String(user.email ?? "").trim().toLowerCase();
  const idSource = user.id || user._id || user.username || user.name || user.email || `${username || email || "user"}-${Date.now()}`;

  return {
    ...user,
    id: normalizeId(idSource),
    username,
    name: user.name ? String(user.name).trim() : username,
    email,
    createdAt: user.createdAt || Date.now(),
    updatedAt: Date.now(),
  };
};

const looksLikeSingleUserRecord = (value) => {
  if (!value || Array.isArray(value) || typeof value !== "object") return false;

  const keys = Object.keys(value);
  if (keys.length === 0) return false;

  const userFields = ["username", "name", "email", "password", "avatar", "profilePic", "profileImage"];
  const hasUserFields = userFields.some((key) => Object.prototype.hasOwnProperty.call(value, key));
  if (!hasUserFields) return false;

  const objectValues = Object.values(value).filter((entry) => entry && typeof entry === "object" && !Array.isArray(entry));
  const primitiveValues = Object.values(value).filter((entry) => entry === null || ["string", "number", "boolean"].includes(typeof entry));

  return primitiveValues.length >= objectValues.length;
};

const toRegistryObject = (value) => {
  if (!value) return {};

  // Legacy shape: a single user object stored directly under the storage key.
  if (looksLikeSingleUserRecord(value)) {
    const normalized = normalizeUser(value);
    return { [normalized.id]: normalized };
  }

  if (Array.isArray(value)) {
    return value.reduce((acc, user) => {
      const normalized = normalizeUser(user);
      acc[normalized.id] = normalized;
      return acc;
    }, {});
  }

  if (typeof value === "object") {
    return Object.entries(value).reduce((acc, [key, user]) => {
      // Ignore primitive entries from malformed legacy data.
      if (!user || typeof user !== "object") return acc;
      const normalized = normalizeUser({ ...(user || {}), id: key || user?.id });
      acc[normalized.id] = normalized;
      return acc;
    }, {});
  }

  return {};
};

const readRegistry = () => {
  if (!isBrowser) return {};

  const current = safeParse(localStorage.getItem(REGISTRY_KEY), null);
  if (current) return toRegistryObject(current);

  const legacy = safeParse(localStorage.getItem(LEGACY_REGISTRY_KEY), null);
  return legacy ? toRegistryObject(legacy) : {};
};

const writeRegistry = (registry) => {
  if (!isBrowser) return registry;
  const normalized = toRegistryObject(registry);
  localStorage.setItem(REGISTRY_KEY, JSON.stringify(normalized));
  localStorage.setItem(LEGACY_REGISTRY_KEY, JSON.stringify(normalized));
  return normalized;
};

const getAllUsers = () => Object.values(readRegistry());

export const saveUser = (userData) => {
  const normalized = normalizeUser(userData);
  const registry = readRegistry();
  registry[normalized.id] = {
    ...(registry[normalized.id] || {}),
    ...normalized,
  };
  writeRegistry(registry);
  return registry[normalized.id];
};

export const upsertUser = (userData) => saveUser(userData);

export const lookupUser = (identifier) => {
  const q = normalizeId(identifier).toLowerCase();
  if (!q) return null;

  return getAllUsers().find((user) => {
    const id = normalizeId(user?.id).toLowerCase();
    const username = normalizeId(user?.username).toLowerCase();
    const name = normalizeId(user?.name).toLowerCase();
    const email = normalizeId(user?.email).toLowerCase();
    return [id, username, name, email].some((value) => value === q);
  }) || null;
};

const removeUser = (identifier) => {
  const q = normalizeId(identifier).toLowerCase();
  if (!q) return {};

  const registry = readRegistry();
  const next = Object.fromEntries(
    Object.entries(registry).filter(([key, user]) => {
      const values = [key, user?.id, user?.username, user?.email].map((v) => normalizeId(v).toLowerCase());
      return !values.includes(q);
    })
  );

  writeRegistry(next);
  return next;
};
