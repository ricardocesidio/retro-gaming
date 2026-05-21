// Seed a demo user account on first load so the "Try Demo" button works
import { saveUser } from "./auth";
import { isBrowser } from "./shared";
import { DEFAULT_AVATAR_FALLBACK } from "./fallbackImage";

export function seedDemoAccount() {
  if (!isBrowser) return;
  try {
    const key = "registeredUsers";
    const existing = localStorage.getItem(key);
    const users = existing ? JSON.parse(existing) : {};

    // Check if demo user already exists
    const exists = Object.values(users).some(
      (u) => String(u?.username || "").toLowerCase() === "demouser"
    );
    if (exists) return;

    saveUser({
      id: "demo-user-1",
      username: "DemoUser",
      name: "Demo User",
      email: "demo@retro-vault.com",
      password: "demo123",
      avatar: DEFAULT_AVATAR_FALLBACK,
      about: "Demo account for exploring the Retro Gaming Marketplace. Feel free to browse, list items, and test all features!",
      country: "Lisbon, Portugal",
      tier: "tier-supreme",
    });
  } catch {
    // Silent — storage might be unavailable
  }
}
