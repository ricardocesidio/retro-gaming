import { Link } from "react-router-dom";
import MarketplaceSection from "../components/MarketplaceSection.jsx";
import { MARKET_PLACEHOLDER_FALLBACK } from "../utils/fallbackImage";
import "./Home.css";

import slide1 from "../images/mainpic0.jpg";
import slide2 from "../images/mainpic2.jpg";
import slide3 from "../images/mainpic3.jpg";
import mobileHero from "../images/logo.png";

export default function Home() {
  const images = [slide1, slide2, slide3];

  return (
    <>
      <div className="banner-outer-wrapper">
        <div className="banner-wrapper">
          <div className="market-container">
            <img
              src={mobileHero}
              alt="Retro Gaming Marketplace"
              className="mobile-hero-img"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = MARKET_PLACEHOLDER_FALLBACK;
              }}
            />
            <div className="banner-slider">
              <div className="banner-slides">
                {images.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Featured retro marketplace item ${index + 1}`}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = MARKET_PLACEHOLDER_FALLBACK;
                    }}
                  />
                ))}
              </div>
              <Link to="/sell" className="banner-click-area">
                START SELLING HERE
              </Link>
            </div>
          </div>
        </div>
      </div>

      <section className="hero">
        <h1>
          <span className="text-shadow-gray">SELL YOUR</span> <span className="text-purple-shadow">GEEK STUFF</span>
        </h1>
        <p className="hero-subtitle">Buy, sell, and trade retro games in a premium marketplace.</p>
      </section>

      <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.88rem", margin: "0 0 32px" }}>
        Start by browsing the market or listing your first item.
      </p>
      <div style={{ marginTop: "20px" }}>
        <MarketplaceSection embedded />
      </div>
    </>
  );
}