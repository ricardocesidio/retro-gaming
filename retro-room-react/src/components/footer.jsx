import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h2 className="footer-logo">MY RETRO ROOM</h2>
          <p className="footer-subtext">Europe's largest retro gaming marketplace</p>
          <div className="brand-socials">
            <a href="#" title="Discord"><i className="fab fa-discord"></i></a>
            <a href="#" title="Twitch"><i className="fab fa-twitch"></i></a>
            <a href="#" title="YouTube"><i className="fab fa-youtube"></i></a>
            <a href="#" title="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="#" title="Twitter"><i className="fab fa-twitter"></i></a>
          </div>
        </div>

        <div className="footer-nav">
          <div className="nav-col">
            <h4>Buy</h4>
            <a href="#">Consoles</a>
            <a href="#">Games</a>
            <a href="#">Arcade</a>
            <a href="#">Accessories</a>
          </div>
          <div className="nav-col">
            <h4>Sell</h4>
            <Link to="/sell">Post an Ad</Link>
            <a href="#">Fees</a>
            <a href="#">Shipping</a>
            <a href="#">Security</a>
          </div>
        </div>

        <div className="footer-end">
          <div className="social-row">
            <a href="#" title="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="#" title="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="#" title="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="#" title="TikTok"><i className="fab fa-tiktok"></i></a>
          </div>

          <div className="payment-row">
            <div className="pay-card"><img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" alt="Apple Pay" /></div>
            <div className="pay-card"><img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" /></div>
            <div className="pay-card"><img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" /></div>
            <div className="pay-card"><img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg" alt="Amex" /></div>
            <div className="pay-card"><img src="https://www.paypalobjects.com/webstatic/i/logo/rebrand/ppcom.svg" alt="PayPal" /></div>
          </div>

          <p className="copyright">© 2026 My Retro Room. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}