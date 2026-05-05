import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMarketListings } from "../hooks/useMarketListings";
import { normalizeProduct } from "../utils/normalizeProduct";
import "./Offer.css";

export default function Offer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { listings } = useMarketListings();
  const [offerAmount, setOfferAmount] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const product = listings?.find((item) => String(item.id) === String(id));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!offerAmount) return;

    // Read existing conversations
    const raw = localStorage.getItem("retroConversations");
    const conversations = raw ? JSON.parse(raw) : [];

    // Find or create conversation with seller
    let conversation = conversations.find(
      (c) => c.product?.id === id || String(c.product?.id) === String(id)
    );

    if (!conversation) {
      conversation = {
        id: Date.now(),
        name: product?.seller || "Seller",
        avatar: product?.sellerAvatar || "https://i.pravatar.cc/150?img=11",
        lastMsg: `Offer: €${offerAmount}`,
        time: "Just now",
        unread: 0,
        product: {
          id: product?.id,
          name: product?.title,
          price: product?.price,
          img: product?.image || product?.images?.[0] || "",
        },
        history: [],
      };
      conversations.push(conversation);
    }

    // Add offer message to history
    const offerMsg = {
      type: "sent",
      text: `📩 Offer: €${offerAmount}${message ? ` - ${message}` : ""}`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    conversation.history.push(offerMsg);
    conversation.lastMsg = `Offer: €${offerAmount}`;
    conversation.time = "Just now";

    localStorage.setItem("retroConversations", JSON.stringify(conversations));
    setSent(true);

    setTimeout(() => {
      navigate(`/messages?seller=${encodeURIComponent(product?.seller || "")}&product=${id}`);
    }, 1500);
  };

  if (sent) {
    return (
      <div className="offer-page">
        <div className="offer-success">
          <i className="fa-solid fa-circle-check" />
          <h2>Offer Sent!</h2>
          <p>Redirecting to messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="offer-page">
      <button type="button" className="btn-back" onClick={() => navigate(-1)}>
        <i className="fa-solid fa-chevron-left" /> Back
      </button>

      <div className="offer-card">
        <h2>Make Your Offer</h2>

        {product && (
          <div className="offer-product">
            <img
              src={product.image || product.images?.[0] || ""}
              alt={product.title}
              className="offer-product-img"
            />
            <div>
              <h3>{product.title}</h3>
              <p className="offer-product-price">€{product.price}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="offer-form">
          <div className="form-group">
            <label htmlFor="offerAmount">Your Offer Amount (€)</label>
            <input
              id="offerAmount"
              type="number"
              value={offerAmount}
              onChange={(e) => setOfferAmount(e.target.value)}
              placeholder="Enter amount"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message (Optional)</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a message to your offer..."
              rows={4}
            />
          </div>

          <button type="submit" className="btn-submit-offer">
            <i className="fa-solid fa-paper-plane" />
            Send Offer
          </button>
        </form>
      </div>
    </div>
  );
}
