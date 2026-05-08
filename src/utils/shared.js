import { DEFAULT_AVATAR_FALLBACK, MARKET_PLACEHOLDER_FALLBACK } from "./fallbackImage";

export const resolveAvatar = (user) => {
  if (!user) return DEFAULT_AVATAR_FALLBACK;
  return user.avatar || user.profilePic || user.profileImage || DEFAULT_AVATAR_FALLBACK;
};

export const resolveProductImage = (product) => {
  if (!product) return MARKET_PLACEHOLDER_FALLBACK;
  if (product.image) return product.image;
  if (product.images && product.images.length > 0) return product.images[0];
  return MARKET_PLACEHOLDER_FALLBACK;
};

export const safeJsonParse = (value, fallback = null) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

export const normalizeImageValue = (img) => {
  if (typeof img === "string") return img.trim();
  if (img?.preview) return String(img.preview).trim();
  if (img?.url) return String(img.url).trim();
  if (img?.src) return String(img.src).trim();
  return "";
};