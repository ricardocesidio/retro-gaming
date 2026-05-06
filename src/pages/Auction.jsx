import { Link } from "react-router-dom";
import "./Auction.css";

export default function Auction() {
  return (
    <div className="auction-page">
      <div className="auction-container">
        <header className="auction-header">
          <h1>AUCTION</h1>
          <p>Premium retro gaming auctions coming soon.</p>
        </header>

        <div className="auction-coming-soon">
          <i className="fa-solid fa-gavel coming-soon-icon" />
          <h2>Under Construction</h2>
          <p>
            The auction system is being prepared for the Retro Gaming Marketplace.
            Check back soon for exclusive retro gaming auctions!
          </p>
          <Link to="/market" className="btn-browse-market">
            Browse Market Instead
          </Link>
        </div>
      </div>
    </div>
  );
}
