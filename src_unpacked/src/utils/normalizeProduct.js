// src/utils/normalizeProduct.js
// Single normalized product schema used across the app.

export const normalizeId = (value) => String(value ?? "").trim();

const cleanString = (value, fallback = "") => String(value ?? fallback).trim();

const slugify = (value) =>
  cleanString(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const hashString = (value) => {
  let hash = 0;
  const input = String(value ?? "");
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash.toString(36);
};

const buildFallbackId = (product = {}) => {
  const seed = [
    product.title ?? product.name ?? product.label ?? "untitled",
    product.category ?? "",
    product.subCategory ?? "",
    product.condition ?? "",
    product.price ?? "",
    product.date ?? product.createdAt ?? product.publishedAt ?? "",
    product.image ?? product.thumbnail ?? product.cover ?? "",
  ].join("|");

  const slug = slugify(product.title ?? product.name ?? product.label ?? "product");
  const hash = hashString(seed);
  return `${slug || "product"}-${hash}`;
};

const cleanPrice = (value) => {
  if (value === null || value === undefined || value === "") return "";
  if (typeof value === "number" && Number.isFinite(value)) return value;

  const raw = String(value).trim();
  if (!raw) return "";

  const numericCandidate = raw.replace(/[^\d,.-]/g, "").replace(/,/g, ".");
  const parsed = Number(numericCandidate);
  if (Number.isFinite(parsed) && /\d/.test(numericCandidate)) return parsed;

  return raw;
};

const normalizeImageValue = (img) => {
  if (typeof img === "string") return img.trim();
  if (img?.preview) return String(img.preview).trim();
  if (img?.url) return String(img.url).trim();
  if (img?.src) return String(img.src).trim();
  return "";
};

const normalizeImageList = (product = {}) => {
  const fromImages = Array.isArray(product.images)
    ? product.images.map(normalizeImageValue).filter(Boolean)
    : [];

  const fallback = normalizeImageValue(
    product.image || product.thumbnail || product.cover || product.media?.[0] || ""
  );

  const merged = [...fromImages];
  if (fallback && !merged.includes(fallback)) merged.unshift(fallback);

  return Array.from(new Set(merged));
};

const cleanDate = (value, createdAt) => {
  if (!value) return new Date(createdAt).toISOString();
  if (typeof value === "number" && Number.isFinite(value)) return new Date(value).toISOString();
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    if (!Number.isNaN(parsed)) return new Date(parsed).toISOString();
    return value;
  }
  return new Date(createdAt).toISOString();
};

export const normalizeProduct = (product = {}) => {
  const createdAt =
    typeof product.createdAt === "number"
      ? product.createdAt
      : typeof product.createdAt === "string" && !Number.isNaN(Date.parse(product.createdAt))
        ? Date.parse(product.createdAt)
        : typeof product.publishedAt === "number"
          ? product.publishedAt
          : Date.now();

  const images = normalizeImageList(product);
  const image = normalizeImageValue(
    product.image || product.thumbnail || product.cover || images[0] || product.media?.[0] || ""
  );

  const explicitId = normalizeId(
    product.id ??
      product._id ??
      product.sku ??
      product.slug ??
      product.productId ??
      product.listingId
  );

  const id = explicitId || buildFallbackId(product);

  return {
    ...product,
    id,
    title: cleanString(product.title ?? product.name ?? product.label, "Untitled product"),
    image,
    images,
    description: cleanString(product.description ?? product.subtitle),
    price: cleanPrice(product.price ?? product.formattedPrice ?? product.value),
    category: cleanString(product.category),
    subCategory: cleanString(product.subCategory),
    condition: cleanString(product.condition),
    status: cleanString(product.status, "active"),
    date: cleanDate(product.date ?? product.createdAt ?? product.publishedAt, createdAt),
    parcelSize: cleanString(product.parcelSize),
    weightRange: cleanString(product.weightRange),
    createdAt,
    publishedAt:
      typeof product.publishedAt === "number" && Number.isFinite(product.publishedAt)
        ? product.publishedAt
        : createdAt,
  };
};
