import React from "react";
import "./profile.css";

const principleCards = [
  ["01. Respect & Inclusivity", "Our vault is a sanctuary. Zero tolerance for harassment or abusive behavior.", "#00d4ff"],
  ["02. Anti-Scam", "All flaws and authenticity certificates must be clearly documented.", "#ffd700"],
  ["03. Data Protection", "AES-256 and TLS 1.3 keep personal data safe and private.", "#9d50bb"],
  ["04. Trade Finality", "Once a contract is sealed, verify all terms before confirming a trade.", "#ff4d7d"],
];

const transactionCards = [
  ["Permitted Transactions", "Authentic collectibles, verified vintage hardware/software, documented restoration projects, and certified graded items.", "fa-circle-check", "#00ffcc"],
  ["Prohibited Items", "Counterfeit goods, stolen property, illegal services, hazardous materials, or anything that undermines trust.", "fa-triangle-exclamation", "#ff4d4d"],
];

export default function RetroRules() {
  return (
    <div className="profile-page-wrapper retro-rules-page">
      <section className="profile-header-card elite-banner-card">
        <div className="profile-info">
          <h1>
            <span id="displayUsername">Retro Vault Rules</span>
            <i className="fa-solid fa-circle-check verified-badge" title="Certified Platform Standards" />
          </h1>
          <div className="profile-meta-info">
            <div className="reviews-group">
              <div className="reviews-diamonds">
                {[...Array(5)].map((_, i) => <i key={i} className="fa-solid fa-gem filled" />)}
              </div>
              <span className="reviews-link" id="reviewScoreText">Trust Framework</span>
            </div>
            <span className="meta-divider">•</span>
            <div className="location-group">
              <i className="fa-solid fa-shield-halved" />
              <span>Enterprise Security</span>
            </div>
          </div>
          <div className="profile-bio">
            <h3 className="bio-title">The Mission</h3>
            <p>The Retro Vault is a secure, social marketplace for authentic collectibles and vintage artifacts.</p>
          </div>
          <div className="profile-bio">
            <h3 className="bio-title">The Workflow</h3>
            <p>Engage via curated wishlists and private messaging. Buyers secure listings responsibly; sellers build authority through transparency.</p>
          </div>
        </div>
      </section>

      <section className="reviews-slider">
        <h2>Core Principles</h2>
        <div className="slider-container principles-grid">
          {principleCards.map(([title, text, accent]) => (
            <article key={title} className="review-card principle-card" style={{ borderLeft: `4px solid ${accent}` }}>
              <h3 style={{ color: accent }}>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="reviews-slider">
        <h2>Transaction Framework</h2>
        <div className="slider-container policy-grid">
          {transactionCards.map(([title, text, icon, accent]) => (
            <article key={title} className="review-card principle-card" style={{ borderLeft: `4px solid ${accent}` }}>
              <h3 style={{ color: accent }}><i className={`fa-solid ${icon}`} /> {title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="reviews-slider">
        <h2>Referral Rewards</h2>
        <div className="slider-container reward-grid">
          {[
            ["5", "Gold Inviter", "+1 gem + Gold Badge", "#ffd700"],
            ["10", "Platinum Inviter", "+2 gems + Platinum Badge", "#e5e4e2"],
            ["20", "Master Inviter", "+5 gems + Featured Listings", "#9d50bb"],
            ["50", "Supreme Inviter", "+10 gems + Vault Legend Status", "#ff4d7d"],
          ].map(([n, label, bonus, color]) => (
            <div className="review-card tier-card" key={label}>
              <div className="reward-number" style={{ color }}>{n}</div>
              <strong style={{ color }}>{label}</strong>
              <span>{bonus}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="reviews-slider">
        <h2>Vault Enforcement</h2>
        <div className="slider-container enforcement-grid">
          {[
            ["Warning", "Initial violation alert", "LEVEL 01"],
            ["Suspension", "Temporary listing freeze", "LEVEL 02"],
            ["Restriction", "Visibility reduction", "LEVEL 03"],
            ["Exclusion", "Permanent vault ban", "TERMINAL"],
          ].map(([title, text, level]) => (
            <div className="review-card enforcement-card" key={title}>
              <div className="enforcement-level">{level}</div>
              <strong>{title}</strong>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
