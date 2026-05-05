// src/context/WishlistContext.jsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { normalizeProduct, normalizeId } from "../utils/normalizeProduct";
import { safeStorageGet, safeStorageSet } from "../utils/marketStorage";

const WISHLIST_KEY = "marketplaceWishlist";
const WishlistContext = createContext(null);

const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const dedupeById = (items = []) => {
  const map = new Map();

  items.forEach((item) => {
    if (!item?.id) return;
    const existing = map.get(item.id);
    const nextScore = Number(item.publishedAt ?? item.createdAt ?? item.addedAt ?? 0);
    const prevScore = Number(existing?.publishedAt ?? existing?.createdAt ?? existing?.addedAt ?? 0);
    if (!existing || nextScore >= prevScore) map.set(item.id, item);
  });

  return Array.from(map.values());
};

const normalizeStoredItem = (item) => {
  if (typeof item === "string") {
    const id = normalizeId(item);
    return id
      ? {
          id,
          title: id,
          image: "",
          images: [],
          description: "",
          price: "",
          status: "active",
          addedAt: Date.now(),
        }
      : null;
  }

  return normalizeProduct(item);
};

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState(() => {
    if (typeof window === "undefined") return [];
    const stored = safeStorageGet(WISHLIST_KEY, []);
    return dedupeById((Array.isArray(stored) ? stored : []).map(normalizeStoredItem).filter(Boolean));
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      safeStorageSet(WISHLIST_KEY, wishlistItems);
    } catch (error) {
      console.error("Failed to persist wishlist:", error);
    }
  }, [wishlistItems]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== WISHLIST_KEY) return;
      const next = safeParse(e.newValue, []);
      setWishlistItems(dedupeById((Array.isArray(next) ? next : []).map(normalizeStoredItem).filter(Boolean)));
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const wishlistIds = useMemo(
    () => new Set(wishlistItems.map((item) => item.id)),
    [wishlistItems]
  );

  const isInWishlist = useCallback(
    (productId) => wishlistIds.has(normalizeId(productId)),
    [wishlistIds]
  );

  const addToWishlist = useCallback((product) => {
    const normalized = normalizeProduct(product);
    if (!normalized?.id) return false;

    setWishlistItems((prev) => {
      if (prev.some((item) => item.id === normalized.id)) return prev;
      return dedupeById([...prev, normalized]);
    });

    return true;
  }, []);

  const removeFromWishlist = useCallback((productOrId) => {
    const id =
      typeof productOrId === "object"
        ? normalizeId(productOrId?.id)
        : normalizeId(productOrId);

    if (!id) return false;
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
    return true;
  }, []);

  const toggleWishlist = useCallback((product) => {
    const normalized = normalizeProduct(product);
    if (!normalized?.id) return false;

    setWishlistItems((prev) => {
      const exists = prev.some((item) => item.id === normalized.id);
      return exists
        ? prev.filter((item) => item.id !== normalized.id)
        : dedupeById([...prev, normalized]);
    });

    return true;
  }, []);

  const clearWishlist = useCallback(() => {
    setWishlistItems([]);
  }, []);

  const getWishlistItem = useCallback(
    (productId) =>
      wishlistItems.find((item) => item.id === normalizeId(productId)) || null,
    [wishlistItems]
  );

  const value = useMemo(
    () => ({
      wishlistItems,
      wishlistCount: wishlistItems.length,
      wishlistIds,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      clearWishlist,
      isInWishlist,
      getWishlistItem,
    }),
    [
      wishlistItems,
      wishlistIds,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      clearWishlist,
      isInWishlist,
      getWishlistItem,
    ]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
}
