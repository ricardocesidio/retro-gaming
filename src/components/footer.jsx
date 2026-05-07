import { Link } from "react-router-dom";
import "./footer.css";

export default function Footer() {
  return (
    <footer className="main-footer" role="contentinfo">
      <div className="footer-container">
        {/* Brand column */}
        <div className="footer-brand">
          <div className="footer-logo">MY RETRO ROOM</div>
          <p className="footer-subtext">
            The premium marketplace for retro gaming collectors.
            Buy, sell and discover rare finds.
          </p>
        </div>

        {/* Nav columns */}
        <nav className="footer-nav" aria-label="Footer navigation">
          <div className="nav-col">
            <strong style={{ color: "var(--text-main)", marginBottom: 6, display: "block", fontSize: "0.8rem", letterSpacing: "1px" }}>MARKETPLACE</strong>
            <Link to="/market">Browse All</Link>
            <Link to="/consoles">Consoles</Link>
            <Link to="/games">Games</Link>
            <Link to="/collectibles">Collectibles</Link>
            <Link to="/auction">Auction</Link>
            <Link to="/sell">Sell an Item</Link>
          </div>
          <div className="nav-col">
            <strong style={{ color: "var(--text-main)", marginBottom: 6, display: "block", fontSize: "0.8rem", letterSpacing: "1px" }}>ACCOUNT</strong>
            <Link to="/profile">Profile</Link>
            <Link to="/wallet">Wallet</Link>
            <Link to="/my-orders">My Orders</Link>
            <Link to="/wishlist">Wishlist</Link>
            <Link to="/settings">Settings</Link>
            <Link to="/invite">Invite Friends</Link>
          </div>
          <div className="nav-col">
            <strong style={{ color: "var(--text-main)", marginBottom: 6, display: "block", fontSize: "0.8rem", letterSpacing: "1px" }}>INFO</strong>
            <Link to="/retro-rules">Rules</Link>
            <Link to="/donations">Support Us</Link>
            <Link to="/auction">Auction</Link>
          </div>
        </nav>

        {/* Right column */}
        <div className="footer-end">
          <div className="social-row">
            <a href="#" onClick={(e) => e.preventDefault()} className="social-placeholder" aria-label="Twitter"><i className="fab fa-x-twitter" /></a>
            <a href="#" onClick={(e) => e.preventDefault()} className="social-placeholder" aria-label="Instagram"><i className="fab fa-instagram" /></a>
            <a href="#" onClick={(e) => e.preventDefault()} className="social-placeholder" aria-label="YouTube"><i className="fab fa-youtube" /></a>
            <a href="#" onClick={(e) => e.preventDefault()} className="social-placeholder" aria-label="Twitch"><i className="fab fa-twitch" /></a>
          </div>
          <p className="copyright">© 2026 My Retro Room. All rights reserved.</p>
          <p className="demo-mode-label">Demo Mode — Frontend Simulation</p>
        </div>
      </div>
    </footer>
  );
}