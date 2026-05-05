// src/utils/userListings.js
// User's own listings utility - integrates with market storage

import { readMarketListings } from "./marketStorage";

const USER_LISTINGS_KEY = "userListings";
const MARKET_KEY = "meusAnunciosRetro";

/**
 * Get user's own listings from storage
 */
export function getUserListings(username) {
  if (!username) return [];
  
  try {
    // Try userListings first
    const raw = localStorage.getItem(USER_LISTINGS_KEY);
    let allListings = raw ? JSON.parse(raw) : [];
    
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
export function getAllListings() {
  try {
    const stored = readMarketListings();
    const raw = localStorage.getItem(USER_LISTINGS_KEY);
    const userListings = raw ? JSON.parse(raw) : [];
    return [...stored, ...userListings];
  } catch {
    return [];
  }
}

/**
 * Get listings by a specific seller
 */
export function getListingsBySeller(sellerName) {
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
 * Get user's active items count
 */
export function getUserActiveCount(username) {
  const listings = getUserListings(username);
  return listings.filter((item) => item.status === "active").length;
}

/**
 * Get seller stats (mock with some variation)
 */
export function getSellerStats(sellerName) {
  const listings = getListingsBySeller(sellerName);
  const total = listings.length;
  const sold = listings.filter((item) => item.status === "sold").length;
  
  // Calculate fake reviews based on sales (for demo)
  const reviewsCount = Math.max(sold * 2, Math.floor(Math.random() * 50) + 10);
  const rating = total > 0 ? (4.5 + Math.random() * 0.5).toFixed(1) : "5.0";
  
  return {
    totalListings: total,
    soldItems: sold,
    activeItems: total - sold,
    reviewsCount,
    rating: parseFloat(rating),
  };
}