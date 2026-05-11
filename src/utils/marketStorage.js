// src/utils/marketStorage.js
import { normalizeProduct } from "./normalizeProduct";
import { isBrowser, safeJsonParse as safeParse, normalizeImageValue } from "./shared.js";

export const MARKET_LISTINGS_KEY = "meusAnunciosRetro";
export const MARKET_LISTINGS_UPDATED_EVENT = "marketplaceListingsUpdated";
const DRAFT_LISTINGS_KEY = "myRetroDrafts";

const STORAGE_IMAGE_CAPS = [4, 3, 2, 1];
const STORAGE_IMAGE_QUALITY = [
  { maxSide: 1200, quality: 0.72 },
  { maxSide: 900, quality: 0.62 },
  { maxSide: 700, quality: 0.56 },
  { maxSide: 560, quality: 0.5 },
  { maxSide: 420, quality: 0.44 },
];

const safeReadArray = (key) => {
  if (!isBrowser) return [];

  try {
    const parsed = safeParse(localStorage.getItem(key), []);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const isQuotaExceededError = (error) => {
  if (!error) return false;
  return (
    error?.name === "QuotaExceededError" ||
    error?.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
    /quota|storage/i.test(String(error?.message || ""))
  );
};

const safeWriteArray = (key, value) => {
  if (!isBrowser) {
    return { ok: true, value: Array.isArray(value) ? value : [] };
  }

  const normalized = Array.isArray(value) ? value : [];
  try {
    localStorage.setItem(key, JSON.stringify(normalized));
    return { ok: true, value: normalized };
  } catch (error) {
    return { ok: false, error };
  }
};

const compareListings = (a, b) => {
  const aTime = Number(a?.publishedAt ?? a?.createdAt ?? a?.updatedAt ?? 0);
  const bTime = Number(b?.publishedAt ?? b?.createdAt ?? b?.updatedAt ?? 0);
  return bTime - aTime;
};

const dedupeById = (items) => {
  const map = new Map();
  items.forEach((item) => {
    if (!item?.id) return;
    const existing = map.get(item.id);
    const nextScore = Number(item.publishedAt ?? item.createdAt ?? item.updatedAt ?? 0);
    const prevScore = Number(existing?.publishedAt ?? existing?.createdAt ?? existing?.updatedAt ?? 0);
    if (!existing || nextScore >= prevScore) map.set(item.id, item);
  });
  return Array.from(map.values());
};

const dispatchUpdate = () => {
  if (!isBrowser) return;
  window.dispatchEvent(new Event(MARKET_LISTINGS_UPDATED_EVENT));
};

const isDataImage = (value) => typeof value === "string" && /^data:image\//i.test(value.trim());

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

const resizeDataImage = async (src, maxSide = 900, quality = 0.62) => {
  if (!isBrowser || typeof document === "undefined") return src;
  if (!isDataImage(src)) return src;

  try {
    const img = await loadImage(src);
    const { width, height } = img;
    const largestSide = Math.max(width || 0, height || 0);
    if (!largestSide || largestSide <= maxSide) {
      return src;
    }

    const scale = Math.min(1, maxSide / largestSide);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));

    const ctx = canvas.getContext("2d");
    if (!ctx) return src;

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    try {
      return canvas.toDataURL("image/webp", quality);
    } catch {
      try {
        return canvas.toDataURL("image/jpeg", quality);
      } catch {
        return src;
      }
    }
  } catch {
    return src;
  }
};

const compactListingSync = (listing, maxImages = 3) => {
  const normalized = normalizeProduct(listing);
  const sourceImages = Array.isArray(normalized.images) && normalized.images.length > 0
    ? normalized.images
    : normalized.image
      ? [normalized.image]
      : [];

  const limitedImages = sourceImages.map(normalizeImageValue).filter(Boolean).slice(0, Math.max(1, maxImages));
  const hero = normalizeImageValue(normalized.image || limitedImages[0] || "");
  const merged = Array.from(new Set([hero, ...limitedImages].filter(Boolean)));

  return normalizeProduct({
    ...normalized,
    image: hero || merged[0] || "",
    images: merged,
  });
};

const compactDraftSync = (draft, maxImages = 2) => {
  const normalized = normalizeProduct(draft);
  const sourceImages = Array.isArray(normalized.images) && normalized.images.length > 0
    ? normalized.images
    : normalized.image
      ? [normalized.image]
      : [];

  const limitedImages = sourceImages.map(normalizeImageValue).filter(Boolean).slice(0, Math.max(1, maxImages));
  const hero = normalizeImageValue(normalized.image || limitedImages[0] || "");
  const merged = Array.from(new Set([hero, ...limitedImages].filter(Boolean)));

  return normalizeProduct({
    id: normalized.id,
    title: normalized.title,
    category: normalized.category,
    subCategory: normalized.subCategory,
    condition: normalized.condition,
    price: normalized.price,
    description: normalized.description,
    parcelSize: normalized.parcelSize,
    weightRange: normalized.weightRange,
    image: hero || merged[0] || "",
    images: merged,
    isDraft: true,
    updatedAt: normalized.updatedAt || Date.now(),
    createdAt: normalized.createdAt || Date.now(),
    publishedAt: normalized.publishedAt || normalized.updatedAt || Date.now(),
    status: normalized.status || "draft",
  });
};

const writeWithProgressiveCompaction = (key, list, compactFn, sizes) => {
  const normalized = Array.isArray(list) ? dedupeById(list.map(normalizeProduct).filter(Boolean)).sort(compareListings) : [];

  for (const size of sizes) {
    const compacted = normalized.map((item) => compactFn(item, size));
    const result = safeWriteArray(key, compacted);
    if (result.ok) return { ok: true, value: compacted };
  }

  return { ok: false, error: new Error(`Failed to persist ${key}.`) };
};

export const readMarketListings = () => {
  if (!isBrowser) return [];
  const stored = safeReadArray(MARKET_LISTINGS_KEY);
  return dedupeById(stored.map(normalizeProduct).filter(Boolean)).sort(compareListings);
};

const writeMarketListings = (listings) => {
  if (!isBrowser) return [];

  const normalized = Array.isArray(listings)
    ? dedupeById(listings.map(normalizeProduct).filter(Boolean)).sort(compareListings)
    : [];
  const countCaps = [50, 40, 30, 20, 15, 10, 5, 1];

  for (const count of countCaps) {
    const trimmed = normalized.slice(0, count);
    const result = writeWithProgressiveCompaction(
      MARKET_LISTINGS_KEY,
      trimmed,
      compactListingSync,
      STORAGE_IMAGE_CAPS
    );
    if (result.ok) {
      dispatchUpdate();
      return result.value;
    }
  }

  const error = new Error("Failed to persist market listings.");
  error.cause = new Error("Local storage quota is full.");
  throw error;
};

export const readDraftListings = () => {
  if (!isBrowser) return [];
  const stored = safeReadArray(DRAFT_LISTINGS_KEY);
  return dedupeById(stored.map(normalizeProduct).filter(Boolean)).sort(compareListings);
};

export const writeDraftListings = (drafts) => {
  if (!isBrowser) return [];

  const base = Array.isArray(drafts) ? drafts : [];
  const deduped = dedupeById(base.map(normalizeProduct).filter(Boolean)).sort(compareListings);
  const sizeCaps = [3, 2, 1];
  const countCaps = [8, 6, 5, 3, 2, 1];

  for (const count of countCaps) {
    const trimmed = deduped.slice(0, count);
    for (const size of sizeCaps) {
      const compacted = trimmed.map((item) => compactDraftSync(item, size));
      const result = safeWriteArray(DRAFT_LISTINGS_KEY, compacted);
      if (result.ok) return compacted;
    }
  }

  const stripped = deduped
    .slice(0, 1)
    .map((item) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      subCategory: item.subCategory,
      condition: item.condition,
      price: item.price,
      description: item.description,
      parcelSize: item.parcelSize,
      image: item.image || item.images?.[0] || "",
      images: [],
      isDraft: true,
      updatedAt: item.updatedAt || Date.now(),
      createdAt: item.createdAt || Date.now(),
    }));

  const fallback = safeWriteArray(DRAFT_LISTINGS_KEY, stripped);
  if (fallback.ok) return stripped;

  const error = new Error("Failed to persist draft listings.");
  error.cause = fallback.error;
  throw error;
};

export const publishMarketListing = async (listing) => {
  if (!isBrowser) {
    return { ok: true, listing: normalizeProduct(listing) };
  }

  const baseNormalized = normalizeProduct({
    ...listing,
    id: listing?.id || listing?.productId || String(Date.now()),
    status: listing?.status || "active",
    createdAt: listing?.createdAt || Date.now(),
    publishedAt: listing?.publishedAt || Date.now(),
  });

  const imageCounts = Array.from(
    new Set([
      Array.isArray(baseNormalized.images) ? baseNormalized.images.length : 0,
      4,
      3,
      2,
      1,
    ])
  ).filter((count) => count > 0);

  let lastError = null;

  for (const imageCount of imageCounts) {
    for (const pass of STORAGE_IMAGE_QUALITY) {
      const candidateImages = await Promise.all(
        (Array.isArray(baseNormalized.images) ? baseNormalized.images : [baseNormalized.image].filter(Boolean))
          .slice(0, imageCount)
          .map((image) => resizeDataImage(image, pass.maxSide, pass.quality))
      );

      const candidate = normalizeProduct({
        ...baseNormalized,
        image: candidateImages[0] || baseNormalized.image || "",
        images: Array.from(new Set(candidateImages.filter(Boolean))),
      });

      const existing = readMarketListings().filter((item) => item.id !== candidate.id);
      try {
        writeMarketListings([candidate, ...existing]);
        return {
          ok: true,
          listing: candidate,
          imageCount: Array.isArray(candidate.images) ? candidate.images.length : 0,
          reduced: imageCount < (Array.isArray(baseNormalized.images) ? baseNormalized.images.length : 0),
        };
      } catch (error) {
        lastError = error;
        if (!isQuotaExceededError(error?.cause || error)) break;
      }
    }
  }

  return {
    ok: false,
    error: lastError || new Error("Failed to publish listing."),
    listing: baseNormalized,
  };
};

export const removeMarketListing = (listingId) => {
  const id = String(listingId ?? "").trim();
  if (!id || !isBrowser) return [];

  const next = readMarketListings().filter((item) => item.id !== id);
  writeMarketListings(next);
  dispatchUpdate();
  return next;
};

export const updateMarketListing = (listingId, updates) => {
  const id = String(listingId ?? "").trim();
  if (!id || !isBrowser) return null;

  const all = readMarketListings();
  const index = all.findIndex((item) => String(item.id) === id);
  if (index === -1) return null;

  const updated = {
    ...all[index],
    ...updates,
    id: all[index].id, // preserve original ID
    updatedAt: Date.now(),
    images: Array.isArray(updates.images) ? updates.images : all[index].images,
  };

  all[index] = normalizeProduct(updated);
  writeMarketListings(all);
  dispatchUpdate();
  return all[index];
};

export const safeStorageGet = (key, fallback) => {
  if (!isBrowser) return fallback;
  try {
    return safeParse(localStorage.getItem(key), fallback);
  } catch {
    return fallback;
  }
};

export const safeStorageSet = (key, value) => {
  if (!isBrowser) return value;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // no-op: callers should decide whether a fallback is needed
  }
  return value;
};

export const isStorageQuotaError = (error) => isQuotaExceededError(error);
