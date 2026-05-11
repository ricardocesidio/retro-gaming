// Seed demo listings into localStorage on first load (empty storage)
// Idempotent — never overwrites existing user data

import DEMO_LISTINGS from "./demoListings";
import { readMarketListings } from "./marketStorage";
import { normalizeProduct } from "./normalizeProduct";

export function seedDemoListings() {
  if (typeof window === "undefined") return;
  try {
    const existing = readMarketListings();
    if (existing.length > 0) return; // Already has data — skip

    const KEY = "meusAnunciosRetro";
    const normalized = DEMO_LISTINGS.map(normalizeProduct);
    localStorage.setItem(KEY, JSON.stringify(normalized));
  } catch {
    // Silent — storage might be unavailable
  }
}
