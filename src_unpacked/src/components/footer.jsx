import { Link } from "react-router-dom";
import "./footer.css";

const COLUMNS = [
  {
    title: "Marketplace",
    links: [
      ["/market", "Browse All"],
      ["/consoles", "Consoles"],
      ["/games", "Games"],
      ["/collectibles", "Collectibles"],
      ["/sell", "Sell an Item"],
    ],
  },
  {
    title: "Account",
    links: [
      ["/profile", "Profile"],
      ["/my-orders", "My Orders"],
      ["/wishlist", "Wishlist"],
      ["/settings", "Settings"],
      ["/invite", "Invite Friends"],
    ],
  },
  {
    title: "Info",
    links: [
      ["/retro-rules", "Rules"],
      ["/donations", "Support Us"],
      ["/community", "Community"],
      ["/blog", "Blog"],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="main-footer" role="contentinfo">
      <div className="footer-container footer-shell">
        <div className="footer-brand">
          <div className="footer-logo">MY RETRO ROOM</div>
          <p className="footer-subtext">
            The premium marketplace for retro gaming collectors. Buy, sell and discover rare finds.
          </p>
          <div className="brand-socials">
            {[
              ["twitter", "fab fa-twitter"],
              ["instagram", "fab fa-instagram"],
              ["discord", "fab fa-discord"],
            ].map(([name, icon]) => (
              <a key={name} href={`https://${name}.com`} target="_blank" rel="noreferrer" aria-label={name}>
                <i className={icon} />
              </a>
            ))}
          </div>
        </div>

        <nav className="footer-nav" aria-label="Footer navigation">
          {COLUMNS.map((column) => (
            <div className="nav-col" key={column.title}>
              <strong>{column.title.toUpperCase()}</strong>
              {column.links.map(([to, label]) => (
                <Link key={to} to={to}>{label}</Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="footer-end">
          <div className="social-row">
            {[
              ["twitter", "fab fa-twitter"],
              ["instagram", "fab fa-instagram"],
              ["youtube", "fab fa-youtube"],
              ["twitch", "fab fa-twitch"],
            ].map(([name, icon]) => (
              <a key={name} href={`https://${name}.com`} target="_blank" rel="noreferrer" aria-label={name}>
                <i className={icon} />
              </a>
            ))}
          </div>
          <p className="copyright">© 2026 My Retro Room. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
