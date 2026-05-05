// src/utils/shared.js
// Centralized shared utilities - single source of truth

import { DEFAULT_AVATAR_FALLBACK, MARKET_PLACEHOLDER_FALLBACK } from "./fallbackImage";

/**
 * Resolve avatar from user object - checks multiple possible field names
 * Single source of truth for avatar resolution
 */
export const resolveAvatar = (user) => {
  if (!user) return DEFAULT_AVATAR_FALLBACK;
  return user.avatar || user.profilePic || user.profileImage || DEFAULT_AVATAR_FALLBACK;
};

/**
 * Resolve user display name
 */
export const resolveUserName = (user) => {
  if (!user) return "Collector";
  return user.username || user.name || "Collector";
};

/**
 * Resolve main product image
 */
export const resolveProductImage = (product) => {
  if (!product) return MARKET_PLACEHOLDER_FALLBACK;
  if (product.image) return product.image;
  if (product.images && product.images.length > 0) return product.images[0];
  return MARKET_PLACEHOLDER_FALLBACK;
};

/**
 * Format price for display
 */
export const formatPrice = (price) => {
  if (typeof price === "number") {
    return `€${price.toFixed(2)}`;
  }
  if (typeof price === "string") {
    return `€${price}`;
  }
  return "—";
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return "Just now";
  
  const now = Date.now();
  const time = typeof timestamp === "number" ? timestamp : new Date(timestamp).getTime();
  const diff = now - time;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return new Date(time).toLocaleDateString();
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
};

/**
 * Debounce function
 */
export const debounce = (fn, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Throttle function
 */
export const throttle = (fn, limit = 100) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Generate unique ID
 */
export const generateId = (prefix = "id") => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Safe JSON parse
 */
export const safeJsonParse = (value, fallback = null) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 */
export const isEmpty = (value) => {
  if (value == null) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
};

/**
 * Class name helper (combines class names)
 */
export const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

/**
 * Sort listings by date
 */
export const sortByDate = (items, order = "desc") => {
  return [...items].sort((a, b) => {
    const dateA = a.createdAt || a.date || 0;
    const dateB = b.createdAt || b.date || 0;
    return order === "desc" ? dateB - dateA : dateA - dateB;
  });
};

/**
 * Sort listings by price
 */
export const sortByPrice = (items, order = "asc") => {
  return [...items].sort((a, b) => {
    const priceA = Number(a.price) || 0;
    const priceB = Number(b.price) || 0;
    return order === "asc" ? priceA - priceB : priceB - priceA;
  });
};

/**
 * Filter items by search term
 */
export const filterBySearch = (items, term, fields = ["title", "description"]) => {
  if (!term.trim()) return items;
  const searchTerm = term.toLowerCase().trim();
  return items.filter((item) =>
    fields.some((field) => {
      const value = item[field];
      return value && String(value).toLowerCase().includes(searchTerm);
    })
  );
};

/**
 * Get condition display class
 */
export const getConditionClass = (condition) => {
  if (!condition) return "";
  return String(condition)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
};

/**
 * Get status display properties
 */
export const getStatusConfig = (status) => {
  const configs = {
    active: { label: "Active", color: "var(--success)", bg: "var(--success-bg)" },
    sold: { label: "Sold", color: "var(--danger)", bg: "var(--danger-bg)" },
    pending: { label: "Pending", color: "var(--warning)", bg: "var(--warning-bg)" },
    processing: { label: "Processing", color: "var(--info)", bg: "var(--info-bg)" },
    shipped: { label: "Shipped", color: "var(--accent-purple)", bg: "var(--accent-glow)" },
    delivered: { label: "Delivered", color: "var(--success)", bg: "var(--success-bg)" },
    canceled: { label: "Canceled", color: "var(--text-muted)", bg: "var(--bg-soft)" },
  };
  return configs[status?.toLowerCase()] || configs.active;
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "");
};

/**
 * Validate username format
 */
export const isValidUsername = (username) => {
  if (!username || username.trim().length < 3) return false;
  if (username.length > 20) return false;
  return /^[a-z0-9_]+$/.test(username.toLowerCase());
};

/**
 * Sleep utility for delays
 */
export const sleep = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));