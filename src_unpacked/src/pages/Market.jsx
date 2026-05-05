import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard.jsx";
import { useMarketListings } from "../hooks/useMarketListings";
import "./Market.css";

const CATEGORIES = [
  "Consoles", "Games", "Controllers", "Gaming Headsets",
  "Simulators", "Virtual Reality", "Books", "Trading Cards",
  "Collectibles", "Retro Arcade", "Apparel", "PC Gaming",
  "Tabletop", "Accessories",
];

const CONDITIONS = ["New", "Like New", "Excellent", "Good", "Fair", "For Parts"];

const SORT_OPTIONS = [
  { value: "newest",    label: "Newest First" },
  { value: "oldest",    label: "Oldest First" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc",label: "Price: High → Low" },
  { value: "alpha",     label: "A → Z" },
];

const normalizeCat = (v) => {
  const clean = String(v ?? "").trim();
  if (!clean) return "";
  return CATEGORIES.find((c) => c.toLowerCase() === clean.toLowerCase()) || clean;
};

function SkeletonCard() {
  return (
    <div className="product-card skeleton-card" aria-hidden="true">
      <div className="skeleton-image" />
      <div className="product-details">
        <div className="skeleton-line long" />
        <div className="skeleton-line short" />
        <div className="skeleton-line medium" />
      </div>
    </div>
  );
}

export default function Market({ embedded = false }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const location   = useLocation();
  const navigate   = useNavigate();
  const { listings: anuncios } = useMarketListings();

  const [searchTerm,        setSearchTerm]        = useState("");
  const [selectedCategory,  setSelectedCategory]  = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [sortBy,            setSortBy]            = useState("newest");
  const [minPrice,          setMinPrice]          = useState("");
  const [maxPrice,          setMaxPrice]          = useState("");
  const [isLoading,         setIsLoading]         = useState(true);
  const [visibleCount,      setVisibleCount]      = useState(12);

  // Simulate brief loading state
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const params   = new URLSearchParams(location.search);
    const category = normalizeCat(params.get("category"));
    const search   = params.get("search") || "";
    setSelectedCategory(category);
    if (search) setSearchTerm(search);
  }, [location.search]);

  useEffect(() => {
    setVisibleCount(12);
  }, [searchTerm, selectedCategory, selectedCondition, sortBy, minPrice, maxPrice]);

  const filteredAnuncios = useMemo(() => {
    let result = [...anuncios];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((ad) =>
        [ad.title, ad.description, ad.category, ad.subCategory, ad.seller]
          .map((v) => String(v ?? "").toLowerCase())
          .some((v) => v.includes(term))
      );
    }

    if (selectedCategory) {
      result = result.filter((ad) =>
        String(ad.category ?? "").toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (selectedCondition) {
      result = result.filter((ad) =>
        String(ad.condition ?? "").toLowerCase() === selectedCondition.toLowerCase()
      );
    }

    const minP = parseFloat(minPrice);
    const maxP = parseFloat(maxPrice);
    if (!isNaN(minP) && minP > 0) result = result.filter((ad) => Number(ad.price) >= minP);
    if (!isNaN(maxP) && maxP > 0) result = result.filter((ad) => Number(ad.price) <= maxP);

    switch (sortBy) {
      case "oldest":     result.sort((a, b) => (a.createdAt ?? 0) - (b.createdAt ?? 0)); break;
      case "price-asc":  result.sort((a, b) => Number(a.price) - Number(b.price));       break;
      case "price-desc": result.sort((a, b) => Number(b.price) - Number(a.price));       break;
      case "alpha":      result.sort((a, b) => String(a.title ?? "").localeCompare(String(b.title ?? ""))); break;
      default:           result.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0)); break;
    }

    return result;
  }, [anuncios, searchTerm, selectedCategory, selectedCondition, sortBy, minPrice, maxPrice]);

  const hasActiveFilters = searchTerm || selectedCategory || selectedCondition || sortBy !== "newest" || minPrice || maxPrice;

  const searchSuggestions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return [];
    return anuncios
      .filter((ad) => String(ad.title ?? "").toLowerCase().includes(term) || String(ad.seller ?? "").toLowerCase().includes(term))
      .slice(0, 5);
  }, [anuncios, searchTerm]);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedCondition("");
    setSortBy("newest");
    setMinPrice("");
    setMaxPrice("");
    setVisibleCount(12);
    if (!embedded) navigate("/market", { replace: true });
  }, [navigate, embedded]);

  const handleWishlistToggle = useCallback((item) => {
    if (!item?.id) return;
    toggleWishlist(item);
  }, [toggleWishlist]);

  const visibleListings = filteredAnuncios.slice(0, visibleCount);
  const canLoadMore = visibleCount < filteredAnuncios.length;

  return (
    <div className={`market-page ${embedded ? "market-embedded" : ""}`}>
      <div className="market-container">
        {!embedded && (
          <header className="market-header">
            <h1>Retro Market</h1>
            <p>Premium retro gaming collectibles marketplace</p>
          </header>
        )}

        <section className="market-filters" aria-label="Market filters">
          {/* Search bar */}
          <div className="search-wrapper" style={{ marginBottom: 16 }}>
            <div className="search-input-wrapper">
              <input
                type="text"
                className="search-input"
                placeholder="Search games, consoles, gear..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search market"
                autoComplete="off"
              />
              <i className="fa-solid fa-magnifying-glass search-icon" />
            </div>
            {searchSuggestions.length > 0 && (
              <div className="search-suggestions" role="listbox" aria-label="Search suggestions">
                {searchSuggestions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="search-suggestion"
                    onClick={() => {
                      setSearchTerm(item.title || "");
                      navigate(`/product/${item.id}`);
                    }}
                  >
                    <span>{item.title}</span>
                    <small>{item.seller || "Community seller"}</small>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pill category scroll bar */}
          <div className="category-pills-scroll" role="list" aria-label="Filter by category">
            <button
              type="button"
              className={`category-pill ${!selectedCategory ? "active" : ""}`}
              onClick={() => setSelectedCategory("")}
              role="listitem"
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`category-pill ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat === selectedCategory ? "" : cat)}
                role="listitem"
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Filters row */}
          <div className="filters-row filters-row-advanced">
            <div className="filter-group">
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                aria-label="Filter by condition"
              >
                <option value="">All Conditions</option>
                {CONDITIONS.map((c) => (
                  <option key={c} value={c.toLowerCase()}>{c}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort listings"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="price-range-group">
              <input
                type="number"
                className="price-input"
                placeholder="Min €"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                min="0"
                aria-label="Minimum price"
              />
              <span className="price-separator">—</span>
              <input
                type="number"
                className="price-input"
                placeholder="Max €"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                min="0"
                aria-label="Maximum price"
              />
            </div>

            {hasActiveFilters && (
              <button type="button" className="btn-clear-filters" onClick={clearFilters}>
                <i className="fa-solid fa-xmark" style={{ marginRight: 6 }} />
                Clear
              </button>
            )}
          </div>

          {/* Results count */}
          {!isLoading && (
            <p className="results-count" aria-live="polite">
              {filteredAnuncios.length === 0
                ? "No results"
                : `${filteredAnuncios.length} item${filteredAnuncios.length !== 1 ? "s" : ""} found`}
            </p>
          )}
        </section>

        {/* Grid */}
        <div className="market-grid">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          ) : filteredAnuncios.length === 0 ? (
            <div className="no-results">
              <i className="fa-solid fa-box-open no-results-icon" />
              <h3>No items found</h3>
              <p>
                {anuncios.length === 0
                  ? "No listings yet. Be the first to sell something!"
                  : "Try adjusting your filters or search term."}
              </p>
              {hasActiveFilters && (
                <button type="button" className="btn-clear-filters" onClick={clearFilters} style={{ marginTop: 20 }}>
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            visibleListings.map((ad) => (
              <ProductCard
                key={ad.id}
                item={ad}
                onWishlistToggle={() => handleWishlistToggle(ad)}
                isInWishlist={isInWishlist(ad.id)}
              />
            ))
          )}

          {!isLoading && canLoadMore && filteredAnuncios.length > 0 && (
            <div style={{ display: "flex", justifyContent: "center", padding: "8px 0 24px", gridColumn: "1 / -1" }}>
              <button type="button" className="btn-view" onClick={() => setVisibleCount((v) => v + 12)}>
                Load more
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}