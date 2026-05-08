import { useCallback, useEffect, useState } from "react";
import {
  readMarketListings,
  MARKET_LISTINGS_UPDATED_EVENT,
  MARKET_LISTINGS_KEY,
} from "../utils/marketStorage";

export function useMarketListings() {
  const [listings, setListings] = useState(() => readMarketListings());

  const refreshListings = useCallback(() => {
    if (typeof window === "undefined") return;
    setListings(readMarketListings());
  }, []);

  useEffect(() => {
    refreshListings();

    const onStorage = (e) => {
      if (e.key === MARKET_LISTINGS_KEY) refreshListings();
    };

    const onCustom = () => refreshListings();
    const onFocus = () => refreshListings();

    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);
    window.addEventListener(MARKET_LISTINGS_UPDATED_EVENT, onCustom);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener(MARKET_LISTINGS_UPDATED_EVENT, onCustom);
    };
  }, [refreshListings]);

  return { listings, refreshListings };
}