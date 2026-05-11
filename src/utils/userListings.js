// src/utils/userListings.js
// User's own listings utility - integrates with market storage

import { readMarketListings } from "./marketStorage";
import { safeJsonParse } from "./shared.js";

const USER_LISTINGS_KEY = "userListings";

/**
 * Get user's own listings from storage
 */
export function getUserListings(username) {
  if (!username) return [];
  
  try {
    // Try userListings first
    const raw = localStorage.getItem(USER_LISTINGS_KEY);
    let allListings = raw ? safeJsonParse(raw, []) : [];
    
    // Also get from market storage
    const marketListings = readMarketListings();
    
    // Combine both sources
    allListings = [...allListings, ...marketListings];
    
    // Filter by seller
    return allListings.filter(
      (item) => String(item.seller || "").toLowerCase() === String(username).toLowerCase()
    );
  } catch {
    return [];
  }
}

/**
 * Get all listings (for finding other sellers' listings)
 */
function getAllListings() {
  try {
    const stored = readMarketListings();
    const raw = localStorage.getItem(USER_LISTINGS_KEY);
    const userListings = raw ? safeJsonParse(raw, []) : [];
    return [...stored, ...userListings];
  } catch {
    return [];
  }
}

/**
 * Get listings by a specific seller
 */
function getListingsBySeller(sellerName) {
  if (!sellerName) return [];
  
  const all = getAllListings();
  return all.filter(
    (item) => String(item.seller || "").toLowerCase() === String(sellerName).toLowerCase()
  );
}

/**
 * Get user's sold items count
 */
export function getUserSoldCount(username) {
  const listings = getUserListings(username);
  return listings.filter((item) => item.status === "sold").length;
}

/**
 * Get seller stats (mock with some variation)
 */
export function getSellerStats(sellerName) {
  const listings = getListingsBySeller(sellerName);
  const total = listings.length;
  const sold = listings.filter((item) => item.status === "sold").length;
  
  // Stable mock reviews based on sales (no random, no flicker)
  const reviewsCount = Math.max(sold * 2, 15);
  const rating = total > 0 ? 4.8 : 5.0;
  
  return {
    totalListings: total,
    soldItems: sold,
    activeItems: total - sold,
    reviewsCount,
    rating,
  };
}