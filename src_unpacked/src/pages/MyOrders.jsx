import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyOrders.css";


const ORDERS = [
  {
    id: "ELT-77210",
    name: "Custom Mech Keyboard: 'Cyber-Ghost' Edition",
    price: "249.99",
    status: "delivered",
    type: "purchase",
    date: "March 15, 2026",
    image:
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=400",
    tracking: "EU998877665DE",
  },
  {
    id: "ELT-88422",
    name: "Limited Edition: Darth Revan High-End Statue",
    price: "1,200.00",
    status: "processing",
    type: "purchase",
    date: "March 28, 2026",
    image:
      "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=400",
    tracking: "PENDING",
  },
  {
    id: "ELT-33155",
    name: "NVIDIA RTX 5080 Ti - 24GB VRAM",
    price: "899.00",
    status: "shipped",
    type: "sale",
    date: "March 20, 2026",
    image:
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=400",
    tracking: "TRACK-992211",
  },
  {
    id: "ELT-11099",
    name: "Retro-Handheld 'Bit-Boy' Console",
    price: "120.50",
    status: "canceled",
    type: "purchase",
    date: "Feb 10, 2026",
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400",
    tracking: "N/A",
  },
];

const TABS = ["all", "processing", "shipped", "delivered", "canceled"];

const formatStatus = (status) => status.charAt(0).toUpperCase() + status.slice(1);

export default function MyOrders() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredOrders = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return ORDERS.filter((order) => {
      const matchesSearch =
        !term ||
        [
          order.name,
          order.id,
          order.type,
          order.status,
          order.date,
          order.tracking,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const matchesTab = activeTab === "all" || order.status === activeTab;

      return matchesSearch && matchesTab;
    });
  }, [searchTerm, activeTab]);

  const handleTracking = (code) => {
    if (!code || code === "PENDING" || code === "N/A") return;
    window.open(`https://www.17track.net/en/track?nums=${code}`, "_blank");
  };

  return (
    <div className="myorders-wrapper">
      <div className="myorders-glass-card">
        <header className="myorders-hero">
          <span className="hero-badge">Elite Membership: Level III</span>
          <h1>My Orders</h1>
          <p className="hero-subtitle">
            Track, manage and review your premium geek acquisitions.
          </p>
        </header>

        <section className="orders-toolbar" aria-label="Search and filters">
          <div className="search-panel">
            <div className="search-label-block">
              <span className="search-label">Search orders</span>
              <span className="search-count">{filteredOrders.length} results</span>
            </div>

            <div className="search-container-full">
              <input
                type="text"
                placeholder="Search by product, order ID, status or tracking code"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search orders"
              />
             
            </div>
          </div>

          <div className="filters-nav">
            <div className="tabs-wrapper">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`tab-item ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {formatStatus(tab)}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="orders-container">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <article key={order.id} className="elite-order-card">
                <div className="order-visual">
                  <div className="img-container">
                    <img src={order.image} alt={order.name} />
                    <span className={`type-tag ${order.type}`}>{order.type}</span>
                  </div>

                  <div className="info-block">
                    <span className="id-tag">#{order.id}</span>
                    <h3 className="product-title">{order.name}</h3>

                    <div className="meta-info">
                      <span className={`status-pill ${order.status}`}>
                        <i className="fa-solid fa-circle" />
                        {formatStatus(order.status)}
                      </span>
                      <span className="date-tag">{order.date}</span>
                    </div>
                  </div>
                </div>

                <div className="price-tag">
                  <span className="label">Total Amount</span>
                  <span className="value">€ {order.price}</span>
                </div>

                <div className="action-stack">
                  <button
                    type="button"
                    className="btn-elite primary"
                    onClick={() => navigate(`/order-details/${order.id}`)}
                  >
                    View Details
                  </button>

                  <button
                    type="button"
                    className="btn-elite secondary"
                    onClick={() => handleTracking(order.tracking)}
                    disabled={order.status === "canceled" || order.status === "processing"}
                  >
                    <i className="fa-solid fa-map-location-dot" />
                    Tracking
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <i className="fa-solid fa-box-open" />
              <h3>Inventory Empty</h3>
              <p>No orders match your current filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}