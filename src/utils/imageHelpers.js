/**
 * Get the primary image URL from a product object
 *Centralizes the repeated pattern: product.image || product.images?.[0] || ""
 */
export const getProductImage = (product) => {
  if (!product) return "";
  return product.image || product.images?.[0] || product.img || "";
};

/**
 * Handle image load errors with fallback
 * Centralizes the onError pattern used across components
 */
export const handleImageError = (e, fallbackSrc = null) => {
  e.currentTarget.onerror = null;
  if (fallbackSrc) {
    e.currentTarget.src = fallbackSrc;
  } else {
    e.currentTarget.style.display = 'none';
    if (e.currentTarget.nextSibling) {
      e.currentTarget.nextSibling.style.display = 'flex';
    }
  }
};
