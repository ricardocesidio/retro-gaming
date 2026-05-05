import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MyOrders.css";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="myorders-wrapper">
      <div className="myorders-glass-card">
        <button type="button" onClick={() => navigate(-1)} className="tab-item back-tab">
          <i className="fa-solid fa-chevron-left" /> Back to Fleet
        </button>

        <div className="details-header order-details-hero">
          <div className="hero-badge">Order Manifest</div>
          <h1>Transaction Record</h1>
          <p>Transaction ID: <span className="order-id-chip">{id}</span></p>
        </div>

        <div className="details-grid order-details-grid">
          <div className="detail-card order-detail-card">
            <h3><i className="fa-solid fa-satellite-dish" /> Delivery Sector</h3>
            <p>
              <strong>Recipient:</strong> John Doe Geek Master<br />
              <strong>Coordinates:</strong> Main Cyber Street, 2049<br />
              <strong>Port:</strong> Neo-Porto, PT 4000-000
            </p>
          </div>

          <div className="detail-card order-detail-card">
            <h3><i className="fa-solid fa-microchip" /> Payment Gateway</h3>
            <p>
              <strong>Method:</strong> Crypto-Credit Euro<br />
              <strong>Security:</strong> 256-bit encrypted<br />
              <strong>Tax Status:</strong> Settled (VAT 23%)
            </p>
          </div>
        </div>

        <div className="details-footer">
          <button
            type="button"
            className="btn-elite primary"
            onClick={() => window.alert("Invoice download coming soon!")}
          >
            <i className="fa-solid fa-file-invoice-dollar" /> Download Digital Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
