import React, { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useMarketListings } from "../hooks/useMarketListings";
import { normalizeProduct } from "../utils/normalizeProduct";
import { resolveProductImage } from "../utils/shared";
import { readConversations, upsertConversation, appendConversationMessage } from "../utils/uiState";
import { DEFAULT_AVATAR_FALLBACK } from "../utils/fallbackImage";
import ProductCard from "../components/ProductCard";
import "./Bundle.css";

export default function Bundle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { listings } = useMarketListings();
  const [bundleItems, setBundleItems] = useState([]);
  const [step, setStep] = useState(1); // 1: confirm first item, 2: add more items

  // First item (the one user clicked "Make a bundle" from)
  const firstItem = useMemo(() => {
    if (!id || !listings) return null;
    const found = listings.find((item) => String(item.id) === String(id));
    return found ? normalizeProduct(found) : null;
  }, [id, listings]);

  // All available items (excluding items already in bundle + first item)
  const availableItems = useMemo(() => {
    if (!listings) return [];
    const bundleIds = new Set([
      String(id),
      ...bundleItems.map((i) => String(i.id))
    ]);
    return listings.filter((item) => !bundleIds.has(String(item.id)));
  }, [id, listings, bundleItems]);

  // Add item to bundle
  const addToBundle = (item) => {
    const itemId = String(item.id);
    // Don't add if already in bundle or is the first item
    if (itemId === String(id)) return;
    if (bundleItems.find((i) => String(i.id) === itemId)) return;
    setBundleItems([...bundleItems, item]);
  };

  // Remove item from bundle
  const removeFromBundle = (itemId) => {
    setBundleItems(bundleItems.filter((i) => String(i.id) !== String(itemId)));
  };

  // Calculate total
  const total = useMemo(() => {
    const firstPrice = firstItem?.price || 0;
    const bundleTotal = bundleItems.reduce((sum, item) => sum + (item.price || 0), 0);
    return (firstPrice + bundleTotal).toFixed(2);
  }, [firstItem, bundleItems]);

  // Get seller name (use first item's seller)
  const sellerName = firstItem?.seller || "Seller";

  // Send bundle offer
  const sendBundleOffer = () => {
    const allItems = firstItem 
      ? [firstItem, ...bundleItems.filter((i) => String(i.id) !== String(firstItem.id))]
      : bundleItems;

    if (allItems.length === 0) {
      alert("Please add at least one item to the bundle.");
      return;
    }

    const itemNames = allItems.map((i) => i.title).join(", ");
    const bundleMsg = {
      type: "sent",
      text: `📦 Bundle Offer: €${total} (${itemNames})`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const conversations = readConversations();
    const existing = conversations.find((c) => c.name === sellerName);

    if (existing) {
      appendConversationMessage(existing.id, bundleMsg);
    } else {
      upsertConversation({
        id: Date.now(),
        name: sellerName,
        avatar: firstItem?.sellerAvatar || DEFAULT_AVATAR_FALLBACK,
        lastMsg: `Bundle offer: €${total}`,
        time: "Just now",
        unread: 0,
        product: {
          id: firstItem?.id,
          name: firstItem?.title,
          price: `€${total}`,
          img: resolveProductImage(firstItem),
        },
        history: [bundleMsg],
      });
    }

    // Navigate to messages
    setTimeout(() => {
      navigate(`/messages?seller=${encodeURIComponent(sellerName)}&product=${firstItem?.id || ""}`);
    }, 100);
  };

  // Proceed to step 2 (add more items)
  const goToAddMore = () => {
    setStep(2);
  };

  return (
    <div className="bundle-page">
      <button 
        type="button" 
        className="btn-back" 
        onClick={() => step === 1 ? navigate(-1) : setStep(1)}
      >
        <i className="fa-solid fa-chevron-left" /> {step === 1 ? "Back" : "Back to Bundle"}
      </button>

      {step === 1 && (
        <div className="bundle-step">
          <h2>Create Your Bundle</h2>
          <p className="bundle-subtitle">Select additional items to bundle with this product</p>
          
          {firstItem ? (
            <div className="bundle-first-item">
              <h3>Selected Item</h3>
              <div className="bundle-item-card">
                <img 
                  src={resolveProductImage(firstItem)}
                  alt={firstItem.title}
                  className="bundle-item-img"
                />
                <div className="bundle-item-info">
                  <h4>{firstItem.title}</h4>
                  <p className="bundle-item-price">€{firstItem.price}</p>
                </div>
                <i className="fa-solid fa-check bundle-check" />
              </div>
            </div>
          ) : (
            <div className="bundle-empty">
              <i className="fa-solid fa-box-open" />
              <p>No item selected. Please go back and select a product to bundle.</p>
              <button className="btn-back" onClick={() => navigate(-1)}>
                <i className="fa-solid fa-chevron-left" /> Back to Market
              </button>
            </div>
          )}

          <button className="btn-next-step" onClick={goToAddMore}>
            <i className="fa-solid fa-plus" />
            Add More Items
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="bundle-step">
          <h2>Add More Items</h2>
          <p className="bundle-subtitle">Select items from the marketplace to add to your bundle</p>

          <div className="bundle-selected-items">
            <h3>Bundle Items ({bundleItems.length + 1})</h3>
              {firstItem && (
                <div className="bundle-item-card">
                  <img 
                    src={resolveProductImage(firstItem)}
                    alt={firstItem.title}
                    className="bundle-item-img"
                  />
                  <div className="bundle-item-info">
                    <h4>{firstItem.title}</h4>
                    <p className="bundle-item-price">€{firstItem.price}</p>
                  </div>
                  <i className="fa-solid fa-check bundle-check" />
                </div>
              )}

              {bundleItems.map((item) => (
                <div key={item.id} className="bundle-item-card">
                  <img 
                    src={resolveProductImage(item)}
                    alt={item.title}
                    className="bundle-item-img"
                  />
                <div className="bundle-item-info">
                  <h4>{item.title}</h4>
                  <p className="bundle-item-price">€{item.price}</p>
                </div>
                <button
                  type="button"
                  className="btn-remove-item"
                  onClick={() => removeFromBundle(item.id)}
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>
            ))}
          </div>

          <div className="bundle-total">
            <strong>Total: €{total}</strong>
          </div>

          <div className="bundle-actions">
            <button
              className="btn-send-bundle"
              onClick={sendBundleOffer}
              disabled={bundleItems.length === 0}
            >
              <i className="fa-solid fa-paper-plane" />
              Send Bundle Offer
            </button>
          </div>

          <div className="bundle-market-link">
            <Link to="/market" className="btn-browse-market">
              <i className="fa-solid fa-magnifying-glass" />
              Browse Market to Add More
            </Link>
          </div>

          {/* Marketplace items to add */}
          <div className="bundle-market-items">
            <h3>Marketplace Items</h3>
            <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
              {availableItems.map((item) => (
                <div key={item.id}>
                  <ProductCard 
                    item={item} 
                    className="bundle-product-card"
                    onClickOverride={() => addToBundle(normalizeProduct(item))}
                  />
                </div>
              ))}
            </div>
           </div>
         </div>
       )}
    </div>
  );
}
