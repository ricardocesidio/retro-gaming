import { useMemo, useState } from "react";
import "./Donations.css";

export default function Donations() {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmountInput, setCustomAmountInput] = useState("");
  const [message, setMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false); // Novo estado para o modal
  const [finalAmount, setFinalAmount] = useState(0); // Para exibir no agradecimento

  const tiers = [
    { amount: 5, tier: "BRONZE", className: "tier-bronze", icon: "fa-coins", subtitle: "Starter support" },
    { amount: 10, tier: "SILVER", className: "tier-silver", icon: "fa-sparkles", subtitle: "Community boost" },
    { amount: 25, tier: "GOLD", className: "tier-gold", icon: "fa-medal", subtitle: "Strong contribution" },
    { amount: 50, tier: "MASTER", className: "tier-master", icon: "fa-crown", subtitle: "Premium support" },
    { amount: 100, tier: "SUPREME", className: "tier-supreme", icon: "fa-gem", subtitle: "Top-tier impact" },
  ];

  const helpCards = [
    { className: "help-ux", icon: "fa-palette", title: "User Experience", text: "Refinements to navigation, spacing, clarity, and overall usability." },
    { className: "help-platform", icon: "fa-server", title: "Platform Growth", text: "New marketplace tools, performance upgrades, and smarter flows." },
    { className: "help-security", icon: "fa-shield-halved", title: "Security & Safety", text: "Fraud prevention, trust systems, and safer account protection." },
    { className: "help-community", icon: "fa-users", title: "Community Features", text: "Improved interactions, events, and collector engagement systems." },
    { className: "help-future", icon: "fa-rocket", title: "Future Features", text: "Roadmap execution, scalable architecture, and innovation work." },
    { className: "help-maintenance", icon: "fa-wrench", title: "Maintenance", text: "Hosting, monitoring, upkeep, and continuous platform stability." },
    { className: "help-support", icon: "fa-heart", title: "Support Team", text: "Better response times, moderation improvements, and user care." },
    { className: "help-innovation", icon: "fa-wand-magic-sparkles", title: "Innovation", text: "Experiments, polish, and premium experiences for the marketplace." },
    { className: "help-expansion", icon: "fa-globe", title: "Global Reach", text: "Multi-language support, international shipping tools, and worldwide collector access." },
    { className: "help-analytics", icon: "fa-chart-line", title: "Data Insights", text: "Smart analytics, trend tracking, and personalized marketplace recommendations." },
  ];

  const impactLevels = [
    { className: "impact-bronze", level: "SMALL IMPACT", price: "€5 — €15", desc: "Helps with maintenance, small improvements, and essential support." },
    { className: "impact-silver", level: "SOLID IMPACT", price: "€10 — €25", desc: "Supports UX improvements, cleaner flows, and steady growth." },
    { className: "impact-gold active", level: "STRONG IMPACT", price: "€25 — €50", desc: "Funds premium features, stronger tools, and platform evolution." },
    { className: "impact-master", level: "POWER IMPACT", price: "€50 — €99", desc: "Accelerates major upgrades, security, and marketplace quality." },
    { className: "impact-supreme", level: "LEGENDARY IMPACT", price: "€100+", desc: "Drives the biggest improvements, innovation, and long-term scale." },
  ];

  const recognitionLevels = [
    { className: "bronze", label: "SUPPORTER" },
    { className: "silver", label: "BACKER" },
    { className: "gold", label: "PATRON" },
    { className: "master", label: "LEGEND" },
    { className: "supreme", label: "SUPREME" },
  ];

  const formatCurrencyInput = (value) => {
    const clean = value.replace(/[^\d.,]/g, "").replace(",", ".");
    if (!clean) return "";
    const num = Number.parseFloat(clean);
    if (Number.isNaN(num)) return "";
    return num.toFixed(2);
  };

  const parsedCustomAmount = useMemo(() => {
    const normalized = customAmountInput.replace(",", ".");
    const value = Number.parseFloat(normalized);
    return Number.isFinite(value) && value > 0 ? value : null;
  }, [customAmountInput]);

  const donationAmount = selectedAmount || parsedCustomAmount || 0;

  const handleDonate = () => {
    if (!donationAmount || donationAmount <= 0) return;
    
    // Simula envio e mostra modal
    setFinalAmount(donationAmount);
    setShowSuccess(true);
    
    // Limpa os campos após o envio
    setSelectedAmount(null);
    setCustomAmountInput("");
    setMessage("");
  };

  return (
    <div className="donations-wrapper">
      
      {/* SUCCESS OVERLAY */}
      {showSuccess && (
        <div className="success-overlay">
          <div className="success-card">
            <div className="success-icon-circle">
              <i className="fa-solid fa-heart-circle-check"></i>
            </div>
            <h2>You're a Legend!</h2>
            <p>
              Your contribution of <strong>€{finalAmount.toFixed(2)}</strong> has been received with love. 
              Together, we are keeping the Vault's heart beating for all collectors.
            </p>
            <button className="btn-close-success" onClick={() => setShowSuccess(false)}>
              Back to the Vault
            </button>
          </div>
        </div>
      )}

      <div className="donations-glass-card">
        <div className="donations-hero">
          <div className="hero-badge">VAULT COMMUNITY</div>
          <h1>Support the Vault</h1>
          <p className="hero-subtitle">
            Your contribution keeps the marketplace alive, secure, and growing.
          </p>
        </div>

        <div className="section">
          <h2 className="section-title">Why Donate?</h2>
          <p className="section-text">
            The Vault is a premium collector marketplace built by the community, for the community. Your donations directly fund infrastructure, security updates, new features, and a better experience for everyone.
          </p>
        </div>

        <div className="section donation-section">
          <h2 className="section-title">Make a Contribution</h2>
          <div className="amount-grid">
            {/* ITEM "ANY" MOVIDO PARA O TOPO */}
            <div className="amount-btn tier-flex" onClick={() => {
                setSelectedAmount(null);
                document.getElementById('customAmount').focus();
            }}>
              <span className="amount-amount">ANY</span>
              <span className="amount-tier">
                <i className="fa-solid fa-infinity" />
                FLEXIBLE
              </span>
              <span className="tier-subtitle">Any amount • Maximum impact</span>
            </div>

            {tiers.map((tier) => {
              const isSelected = selectedAmount === tier.amount;
              return (
                <button
                  key={tier.amount}
                  type="button"
                  className={`amount-btn ${tier.className} ${isSelected ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedAmount(tier.amount);
                    setCustomAmountInput("");
                  }}
                >
                  <span className="amount-amount">€{tier.amount}</span>
                  <span className="amount-tier">
                    <i className={`fa-solid ${tier.icon}`} />
                    {tier.tier}
                  </span>
                  <span className="tier-subtitle">{tier.subtitle}</span>
                </button>
              );
            })}
          </div>
          

          <div className="custom-amount">
            <label htmlFor="customAmount">Custom amount (€)</label>
            <div className="custom-amount-field">
              <span className="currency-prefix">€</span>
              <input
                id="customAmount"
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={customAmountInput}
                onChange={(e) => {
                  let value = e.target.value.replace(/[^0-9.,]/g, "");
                  if (value.includes(",")) value = value.replace(",", ".");
                  const parts = value.split(".");
                  if (parts.length > 2) value = parts[0] + "." + parts[1];
                  setCustomAmountInput(value);
                  setSelectedAmount(null);
                }}
                onBlur={(e) => {
                  const formatted = formatCurrencyInput(e.target.value);
                  setCustomAmountInput(formatted);
                }}
              />
            </div>
            <p className="field-hint">Values are formatted automatically in euros.</p>
          </div>

          <div className="message-section">
            <label htmlFor="donationMessage">Message (optional)</label>
            <textarea
              id="donationMessage"
              rows="4"
              placeholder="Suggestions, feedback, ideas, or anything you'd like to share with us..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <button className="btn-donate" onClick={handleDonate} type="button">
            <i className="fa-solid fa-heart" />
            DONATE €{donationAmount ? donationAmount.toFixed(2) : "0.00"} NOW
          </button>
        </div>

        <div className="section">
          <h2 className="section-title">How Your Donation Helps</h2>
          <div className="transparency-grid">
            {helpCards.map((card) => (
              <div key={card.title} className={`transparency-card ${card.className}`}>
                <div className="card-icon-wrap">
                  <i className={`fa-solid ${card.icon}`} />
                </div>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">Your Impact</h2>
          <div className="impact-grid">
            {/* ITEM "CUSTOM IMPACT" MOVIDO PARA O TOPO */}
            <div className="impact-card impact-flex">
              <div className="impact-level">CUSTOM IMPACT</div>
              <p className="impact-price">€ Any amount</p>
              <p className="impact-desc">Define your own legacy. Maximum flexibility and personal recognition.</p>
            </div>

            {impactLevels.map((impact) => (
              <div key={impact.level} className={`impact-card ${impact.className}`}>
                <div className="impact-level">{impact.level}</div>
                <p className="impact-price">{impact.price}</p>
                <p className="impact-desc">{impact.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">Recognition Levels</h2>
          <div className="recognition-grid">
            {recognitionLevels.map((level) => (
              <div key={level.label} className={`badge ${level.className}`}>
                {level.label}
              </div>
            ))}
          </div>
          <p className="recognition-note">
            Optional. Become a recognized supporter in the Vault Hall of Fame.
          </p>
        </div>

        <div className="section trust-section">
          <div className="trust-content">
            <div className="trust-lock">
              <i className="fa-solid fa-lock" />
            </div>
            <h3>Secure &amp; Transparent</h3>
            <p>
              All donations are processed securely through industry-standard providers. 100% of funds go directly to the platform. Monthly transparency reports will be published in the community.
            </p>
            <div className="trust-points">
              <span><i className="fa-solid fa-shield-halved" /> Secure processing</span>
              <span><i className="fa-solid fa-file-lines" /> Clear reporting</span>
              <span><i className="fa-solid fa-circle-check" /> Trusted workflow</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}