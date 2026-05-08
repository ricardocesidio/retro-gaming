// src/pages/OrderDetails.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MyOrders.css";

const OrderDetails = () => {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const [invoiceMsg, setInvoiceMsg] = React.useState('');

  return (
    <div className="myorders-wrapper">
      <div className="myorders-glass-card">

        {/* ── FIXED: type="button" so it never accidentally submits a form ── */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="tab-item"
          style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
        >
          <i className="fa-solid fa-chevron-left" /> Back to Fleet
        </button>

        <div className="details-header" style={{ textAlign: "center", marginTop: "40px" }}>
          <h1 style={{ color: "#fff", fontSize: "2.5rem" }}>Order Manifest</h1>
          <span style={{ color: "var(--elite-purple)", fontWeight: 800, letterSpacing: "1px" }}>
            TRANSACTION ID:{" "}
            <span style={{ color: "var(--neon-yellow)" }}>{id}</span>
          </span>
        </div>

        <div
          className="details-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "30px",
            marginTop: "50px",
          }}
        >
          {/* Shipping Info */}
          <div
            className="detail-card"
            style={{
              background: "rgba(255,255,255,0.03)",
              padding: "30px",
              borderRadius: "24px",
              border: "1px solid var(--glass-border)",
            }}
          >
            <h3 style={{ color: "var(--neon-yellow)", marginBottom: "15px" }}>
              <i className="fa-solid fa-satellite-dish" /> Delivery Sector
            </h3>
            <p style={{ color: "#ccc", lineHeight: "1.6", fontSize: "0.95rem" }}>
              <strong>Recipient:</strong> John Doe Geek Master<br />
              <strong>Coordinates:</strong> Main Cyber Street, 2049<br />
              <strong>Port:</strong> Neo-Porto, PT 4000-000
            </p>
          </div>

          {/* Payment Info */}
          <div
            className="detail-card"
            style={{
              background: "rgba(255,255,255,0.03)",
              padding: "30px",
              borderRadius: "24px",
              border: "1px solid var(--glass-border)",
            }}
          >
            <h3 style={{ color: "var(--neon-yellow)", marginBottom: "15px" }}>
              <i className="fa-solid fa-microchip" /> Payment Gateway
            </h3>
            <p style={{ color: "#ccc", lineHeight: "1.6", fontSize: "0.95rem" }}>
              <strong>Method:</strong> Crypto-Credit Euro<br />
              <strong>Security:</strong> 256-bit Encrypted<br />
              <strong>Tax Status:</strong> Settled (VAT 23%)
            </p>
          </div>
        </div>

        <div style={{ marginTop: "50px", textAlign: "center" }}>
          {/* ── FIXED: type="button" prevents accidental form submission ── */}
          <button
            type="button"
            className="btn-elite primary"
            style={{ maxWidth: "350px" }}
            onClick={() => { setInvoiceMsg('Invoice download coming soon!'); setTimeout(() => setInvoiceMsg(''), 3000); }}
          >
            <i className="fa-solid fa-file-invoice-dollar" /> Download Digital Invoice
          </button>
          {invoiceMsg && <p style={{ marginTop: 12, color: 'var(--text-muted)', fontSize: '0.85rem' }}>{invoiceMsg}</p>}
        </div>

      </div>
    </div>
  );
};

export default OrderDetails;
