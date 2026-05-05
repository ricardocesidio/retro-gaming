import { Link } from "react-router-dom";
import MarketplaceSection from "../components/MarketplaceSection.jsx";
import { MARKET_PLACEHOLDER_FALLBACK } from "../utils/fallbackImage";

import slide1 from "../images/mainpic0.jpg";
import slide2 from "../images/mainpic2.jpg";
import slide3 from "../images/mainpic3.jpg";

export default function Home() {
  const images = [slide1, slide2, slide3];

  return (
    <>
      <div className="banner-outer-wrapper">
        <div className="banner-wrapper">
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
            <Link to="/sell" className="banner-click-area">START SELLING HERE</Link>
          </div>
        </div>
      </div>

      <section className="hero">
        <h1>SELL YOUR <span className="highlight">GEEK STUFF</span></h1>
        <p className="hero-subtitle">Premium retro marketplace for consoles, games, collectibles and rare finds.</p>
      </section>

      <div className="section-gap">
        <MarketplaceSection embedded />
      </div>
    </>
  );
}
