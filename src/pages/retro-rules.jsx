import React from "react";
import { Link } from "react-router-dom";
import "./profile.css";

export default function RetroRules() {
  return (
    <div className="profile-page-wrapper">
      <section className="profile-header-card elite-tech">
  <div className="profile-info">
    <h1>
      <span id="displayUsername">Retro Vault Rules</span>
      <i
        className="fa-solid fa-circle-check verified-badge"
        title="Certified Platform Standards"
      ></i>
    </h1>

    <div className="profile-meta-info">
      <div className="reviews-group">
        <div className="reviews-diamonds">
          {[...Array(5)].map((_, i) => (
            <i key={i} className="fa-solid fa-gem filled"></i>
          ))}
        </div>
        <span className="reviews-link" id="reviewScoreText">
          Trust Framework
        </span>
      </div>

      <span className="meta-divider">|</span>

      <div className="location-group">
        <i className="fa-solid fa-shield-halved"></i>
        <span>Enterprise Security</span>
      </div>
    </div>

    <div className="profile-bio">
      <div>
        <h3 className="bio-title">The Mission</h3>
        <p>
          The Retro Vault is a secure, social marketplace for authentic
          collectibles and vintage artifacts. We facilitate trust through 
          reputation tiers and community-driven validation.
        </p>
      </div>

      <div>
        <h3 className="bio-title">The Workflow</h3>
        <p>
          Engage via curated wishlists and private messaging. Buyers secure 
          listings responsibly, while Sellers establish authority through 
          transparency and consistent delivery.
        </p>
      </div>
    </div>
  </div>
</section>

      <section className="reviews-slider">
  <h2>Core Principles</h2>
  <div className="slider-container">
    <div className="review-card" style={{ display: "block" }}>
      
      <div className="rules-principles-grid" style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
        gap: "20px" 
      }}>
        
        {/* 1. Respect & Inclusivity */}
        <div style={{ 
          padding: "20px", 
          borderLeft: "4px solid #00BFFF", 
          backgroundColor: "rgba(0, 191, 255, 0.05)",
          borderRadius: "0 12px 12px 0"
        }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#00BFFF", fontSize: "18px" }}>01. Respect & Inclusivity</h3>
          <p style={{ fontSize: "13px", lineHeight: "1.5", margin: 0 }}>
            <strong>Our vault is a sanctuary.</strong> Zero tolerance for harassment or abusive behavior. 
            Treat every member with the respect you expect for your own collection.
          </p>
        </div>

        {/* 2. Anti-Scam & Transparency */}
        <div style={{ 
          padding: "20px", 
          borderLeft: "4px solid #FFD700", 
          backgroundColor: "rgba(255, 215, 0, 0.05)",
          borderRadius: "0 12px 12px 0"
        }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#FFD700", fontSize: "18px" }}>02. Anti-Scam</h3>
          <p style={{ fontSize: "13px", lineHeight: "1.5", margin: 0 }}>
            <strong>Deception results in immediate ban.</strong> All flaws and authenticity certificates 
            must be clearly documented. Integrity is our highest currency.
          </p>
        </div>

        {/* 3. Data Protection */}
        <div style={{ 
          padding: "20px", 
          borderLeft: "4px solid #8A2BE2", 
          backgroundColor: "rgba(138, 43, 226, 0.05)",
          borderRadius: "0 12px 12px 0"
        }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#8A2BE2", fontSize: "18px" }}>03. Data Protection</h3>
          <p style={{ fontSize: "13px", lineHeight: "1.5", margin: 0 }}>
            <strong>Bank-level encryption.</strong> AES-256 and TLS 1.3 protocols protect your 
            personal data. Your master key is your responsibility; keep it offline.
          </p>
        </div>

        {/* 4. Trade Finality */}
        <div style={{ 
          padding: "20px", 
          borderLeft: "4px solid #FF00FF", 
          backgroundColor: "rgba(255, 0, 255, 0.05)",
          borderRadius: "0 12px 12px 0"
        }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#FF00FF", fontSize: "18px" }}>04. Trade Finality</h3>
          <p style={{ fontSize: "13px", lineHeight: "1.5", margin: 0 }}>
            <strong>The seal is final.</strong> Once a contract is sealed in the vault, it cannot 
            be reversed. Verify all terms and condition guarantees before signing.
          </p>
        </div>

      </div>

      <div style={{ 
        textAlign: "center", 
        marginTop: "30px", 
        paddingTop: "20px", 
        borderTop: "1px solid #333",
        fontSize: "12px",
        color: "#666",
        fontStyle: "italic"
      }}>
        "In the Vault, we trust the code and the collector."
      </div>

    </div>
  </div>
</section>

      <section className="reviews-slider">
  <h2>Transaction Framework</h2>
  <div className="slider-container">
    <div className="review-card" style={{ display: "block" }}>
      
      {/* Grid de Permissões */}
      <div className="rules-principles-grid" style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
        gap: "16px", 
        marginBottom: "24px" 
      }}>
        
        {/* PERMITTED */}
        <div style={{ 
          padding: "20px", 
          border: "2px solid #00FFCC", 
          borderRadius: "12px", 
          background: "linear-gradient(135deg, rgba(0, 255, 204, 0.05) 0%, rgba(0, 0, 0, 0.2) 100%)"
        }}>
          <strong style={{ color: "#00FFCC", fontSize: "18px", display: "block", marginBottom: "10px" }}>
            ✓ Permitted Transactions
          </strong>
          <p style={{ fontSize: "13px", lineHeight: "1.6", color: "#e0e0e0" }}>
            Authentic collectibles, verified vintage hardware/software, documented restoration 
            projects, and certified graded items.
          </p>
        </div>

        {/* PROHIBITED */}
        <div style={{ 
          padding: "20px", 
          border: "2px solid #FF3131", 
          borderRadius: "12px", 
          background: "linear-gradient(135deg, rgba(255, 49, 49, 0.05) 0%, rgba(0, 0, 0, 0.2) 100%)"
        }}>
          <strong style={{ color: "#FF3131", fontSize: "18px", display: "block", marginBottom: "10px" }}>
            ✕ Prohibited Items
          </strong>
          <p style={{ fontSize: "13px", lineHeight: "1.6", color: "#e0e0e0" }}>
            Counterfeit goods, stolen property, illegal services, hazardous materials, 
            or any item violating platform integrity.
          </p>
        </div>
      </div>

       {/* Protocolos de Usuário */}
      <div className="rules-grid" style={{ 
        display: "grid", 
        gridTemplateColumns: "1fr 1fr", 
        gap: "16px",
        padding: "20px",
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        borderRadius: "12px",
        border: "1px solid #333"
      }}>
        <div>
          <strong style={{ color: "#8A2BE2", fontSize: "14px" }}>SELLER PROTOCOL</strong>
          <ul style={{ fontSize: "12px", color: "#bbb", paddingLeft: "18px", marginTop: "8px" }}>
            <li>High-res multi-angle photos</li>
            <li>Accurate condition grading</li>
            <li>Ship within 3 business days</li>
          </ul>
        </div>
        <div>
          <strong style={{ color: "#00BFFF", fontSize: "14px" }}>BUYER PROTOCOL</strong>
          <ul style={{ fontSize: "12px", color: "#bbb", paddingLeft: "18px", marginTop: "8px" }}>
            <li>Review seller gems & tiers</li>
            <li>Verify provenance docs</li>
            <li>Check history before commitment</li>
          </ul>
        </div>
      </div>

    </div>
  </div>
</section>
      <section className="reviews-slider">
  <h2>Gems & Reputation System</h2>
  <div className="slider-container">
    <div className="review-card" style={{ display: "block" }}>
      <p>
        The Retro Vault employs a dual reputation system: <strong>gems</strong>{" "}
        (overall trust score) and <strong>reviews</strong> (transaction feedback).
      </p>
      
      <div className="rules-grid" style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
        gap: "12px", 
        margin: "20px 0" 
      }}>
        {/* BRONZE */}
        <div style={{ 
          padding: "14px", 
          border: "2px solid #CD7F32", 
          borderRadius: "10px", 
          textAlign: "center" 
        }}>
          <div style={{ fontSize: "26px", color: "#CD7F32", marginBottom: "6px" }}>BRONZE</div>
          <div style={{ fontSize: "12px", color: "#959595" }}>≤ 1 gem</div>
        </div>

        {/* SILVER */}
        <div style={{ 
          padding: "14px", 
          border: "2px solid #C0C0C0", 
          borderRadius: "10px", 
          textAlign: "center" 
        }}>
          <div style={{ fontSize: "26px", color: "#C0C0C0", marginBottom: "6px" }}>SILVER</div>
          <div style={{ fontSize: "12px", color: "#959595" }}>Gems 1</div>
        </div>

        {/* GOLD */}
        <div style={{ 
          padding: "14px", 
          border: "2px solid #FFD700", 
          borderRadius: "10px", 
          textAlign: "center" 
        }}>
          <div style={{ fontSize: "26px", color: "#FFD700", marginBottom: "6px" }}>GOLD</div>
          <div style={{ fontSize: "12px", color: "#959595" }}>Gems 3</div>
        </div>

        {/* PLATINUM - Cinza platinado */}
        <div style={{ 
          padding: "14px", 
          border: "3px solid #E5E4E2", 
          borderRadius: "10px", 
          background: "linear-gradient(135deg, #e5e4e220 0%, #c0c0c020 100%)",
          textAlign: "center" 
        }}>
          <div style={{ fontSize: "26px", color: "#E5E4E2", marginBottom: "6px" }}>PLATINUM</div>
          <div style={{ fontSize: "12px", color: "#959595" }}>5 gems + 20-49 reviews</div>
        </div>

        {/* MASTER - Roxo */}
        <div style={{ 
          padding: "14px", 
          border: "3px solid #8A2BE2", 
          borderRadius: "10px", 
          background: "linear-gradient(135deg, #8a2be220 0%, #9932cc20 100%)",
          textAlign: "center" 
        }}>
          <div style={{ fontSize: "26px", color: "#8A2BE2", marginBottom: "6px" }}>MASTER</div>
          <div style={{ fontSize: "12px", color: "#959595" }}>4.5+ gems + 50-99 reviews</div>
        </div>

        {/* SUPREME - Chroma vibrante */}
        <div style={{ 
          padding: "14px", 
          border: "3px solid #FF00FF", 
          borderRadius: "10px", 
          background: "linear-gradient(135deg, #b7b7b720 0%, #c6c5c720 100%)",
          textAlign: "center" 
        }}>
          <div style={{ fontSize: "26px", color: "#FF00FF", marginBottom: "6px" }}>SUPREME</div>
          <div style={{ fontSize: "12px", color: "#959595" }}>4.5+ gems + 100+ reviews</div>
        </div>
      </div>

      <p style={{ fontSize: "14px", color: "#666" }}>
        <strong>Warning:</strong> Review manipulation constitutes fraud. 
        Violations result in immediate tier reset.
      </p>
    </div>
  </div>
</section>

    <section className="reviews-slider">
  <h2>Invite Rewards Program</h2>
  <div className="slider-container">
    <div className="review-card" style={{ display: "block" }}>
      <p>
        Grow your vault network and unlock exclusive rewards. Each accepted 
        invite accelerates your gem progression and unlocks special badges.
      </p>
      
      <div className="rules-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr)", gap: "16px", margin: "24px 0" }}>
        
        {/* GOLD */}
        <div style={{ 
          padding: "16px", 
          border: "2px solid #FFD700", 
          borderRadius: "12px", 
          textAlign: "center" 
        }}>
          <div style={{ fontSize: "24px", color: "#FFD700", marginBottom: "8px", fontWeight: "bold" }}>5</div>
          <strong style={{ color: "#FFD700" }}>Gold Inviter</strong><br/>
          <span style={{ fontSize: "14px" }}>+1 gem + Gold Badge</span>
        </div>

        {/* PLATINUM */}
        <div style={{ 
          padding: "16px", 
          border: "3px solid #E5E4E2", 
          borderRadius: "12px", 
          background: "linear-gradient(135deg, #e5e4e220 0%, #c0c0c020 100%)",
          textAlign: "center" 
        }}>
          <div style={{ fontSize: "24px", color: "#E5E4E2", marginBottom: "8px", fontWeight: "bold" }}>10</div>
          <strong style={{ color: "#E5E4E2" }}>Platinum Inviter</strong><br/>
          <span style={{ fontSize: "14px" }}>+2 gems + Platinum Badge</span>
        </div>

        {/* MASTER */}
        <div style={{ 
          padding: "16px", 
          border: "3px solid #8A2BE2", 
          borderRadius: "12px", 
          background: "linear-gradient(135deg, #8a2be220 0%, #9932cc20 100%)",
          textAlign: "center" 
        }}>
          <div style={{ fontSize: "24px", color: "#8A2BE2", marginBottom: "8px", fontWeight: "bold" }}>20</div>
          <strong style={{ color: "#8A2BE2" }}>Master Inviter</strong><br/>
          <span style={{ fontSize: "14px" }}>+5 gems + Featured Listings</span>
        </div>

        {/* SUPREME */}
        <div style={{ 
          padding: "16px", 
          border: "3px solid #FF00FF", 
          borderRadius: "12px", 
          background: "linear-gradient(135deg, #b7b7b720 0%, #c6c5c720 100%)",
          textAlign: "center" 
        }}>
          <div style={{ fontSize: "24px", color: "#FF00FF", marginBottom: "8px", fontWeight: "bold" }}>50</div>
          <strong style={{ color: "#FF00FF" }}>Supreme Inviter</strong><br/>
          <span style={{ fontSize: "14px" }}>+10 gems + Vault Legend Status</span>
        </div>

      </div>

      <p style={{ fontSize: "14px", color: "#666" }}>
        <strong>Mechanics:</strong> Each accepted invite = +0.5 gems. Milestones unlock 
        bonus gems + badges. Supreme inviters get priority in search results.
      </p>
    </div>
  </div>
</section>

     <section className="reviews-slider">
  <h2>Enforcement & Resolution</h2>
  <div className="slider-container">
    <div className="review-card" style={{ display: "block" }}>
      <p style={{ marginBottom: "20px" }}>
        Users bear full responsibility for transaction decisions and compliance. 
        The vault employs AI pattern detection and manual review to maintain integrity.
      </p>

      {/* Grid de Severidade */}
      <div className="rules-grid" style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr)", 
        gap: "12px", 
        margin: "24px 0" 
      }}>
        
        {/* Nível 1 - Warning */}
        <div style={{ 
          padding: "12px", 
          border: "2px solid #FFD700", 
          borderRadius: "10px", 
          textAlign: "center",
          background: "rgba(255, 215, 0, 0.05)"
        }}>
          <div style={{ fontSize: "12px", color: "#FFD700", fontWeight: "bold" }}>LEVEL 01</div>
          <strong style={{ display: "block", margin: "4px 0" }}>Warning</strong>
          <span style={{ fontSize: "11px", color: "#959595" }}>Initial violation alert</span>
        </div>

        {/* Nível 2 - Suspension */}
        <div style={{ 
          padding: "12px", 
          border: "2px solid #FF8C00", 
          borderRadius: "10px", 
          textAlign: "center",
          background: "rgba(255, 140, 0, 0.05)"
        }}>
          <div style={{ fontSize: "12px", color: "#FF8C00", fontWeight: "bold" }}>LEVEL 02</div>
          <strong style={{ display: "block", margin: "4px 0" }}>Suspension</strong>
          <span style={{ fontSize: "11px", color: "#959595" }}>Temporary listing freeze</span>
        </div>

        {/* Nível 3 - Restriction */}
        <div style={{ 
          padding: "12px", 
          border: "2px solid #FF4500", 
          borderRadius: "10px", 
          textAlign: "center",
          background: "rgba(255, 69, 0, 0.05)"
        }}>
          <div style={{ fontSize: "12px", color: "#FF4500", fontWeight: "bold" }}>LEVEL 03</div>
          <strong style={{ display: "block", margin: "4px 0" }}>Restriction</strong>
          <span style={{ fontSize: "11px", color: "#959595" }}>Visibility reduction</span>
        </div>

        {/* Nível 4 - Exclusion */}
        <div style={{ 
          padding: "12px", 
          border: "3px solid #FF0000", 
          borderRadius: "10px", 
          textAlign: "center",
          background: "linear-gradient(135deg, rgba(255, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.2) 100%)"
        }}>
          <div style={{ fontSize: "12px", color: "#FF0000", fontWeight: "bold" }}>TERMINAL</div>
          <strong style={{ display: "block", margin: "4px 0" }}>Exclusion</strong>
          <span style={{ fontSize: "11px", color: "#959595" }}>Permanent vault ban</span>
        </div>

      </div>

      {/* Call to Action - Report */}
      <div style={{ 
        marginTop: "20px", 
        padding: "15px", 
        backgroundColor: "#1a1a1a", 
        borderRadius: "8px", 
        borderLeft: "4px solid #FF00FF",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <span style={{ fontSize: "14px" }}>
          Evidence-based disputes are prioritized.
        </span>
        <strong style={{ color: "#FF00FF", fontSize: "14px" }}>
          Settings &gt; Report Issue
        </strong>
      </div>

    </div>
  </div>
</section>

    </div>
  );
}