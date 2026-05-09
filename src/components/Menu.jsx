import { NavLink } from "react-router-dom";

export default function Menu() {
  return (
    <>
      {/* Desktop category bar — original, unchanged */}
      <nav className="category-bar desktop-nav" aria-label="Category navigation">
        <div className="nav-links">
          <NavLink to="/" end aria-label="Home"><i className="fa-solid fa-home" /></NavLink>
          <NavLink to="/consoles" aria-label="Consoles" className="gray-icon"><i className="fa-solid fa-gamepad" /></NavLink>
          <NavLink to="/games" aria-label="Games" className="gray-icon"><i className="fa-solid fa-compact-disc" /></NavLink>
          <NavLink to="/sell" className="sell-highlight" aria-label="Sell"><i className="fa-solid fa-plus" /></NavLink>
          <NavLink to="/collectibles" aria-label="Collectibles" className="gray-icon"><i className="fa-solid fa-star" /></NavLink>
          <NavLink to="/arcade" aria-label="Arcade" className="gray-icon"><i className="fa-solid fa-rocket" /></NavLink>
          <NavLink to="/auction" className="auction-icon" aria-label="Auction"><i className="fa-solid fa-gavel" /></NavLink>
        </div>
      </nav>

      {/* Mobile bottom nav — visible only on mobile */}
      <nav className="bottom-nav mobile-nav" aria-label="Mobile navigation">
        <div className="bottom-nav-links">
          <NavLink to="/" end aria-label="Home">
            <i className="fa-solid fa-home" />
            <span className="nav-label">Home</span>
          </NavLink>
          <NavLink to="/market" aria-label="Browse" className="gray-icon">
            <i className="fa-solid fa-magnifying-glass" />
            <span className="nav-label">Browse</span>
          </NavLink>
          <NavLink to="/sell" className="sell-highlight" aria-label="Sell">
            <i className="fa-solid fa-plus" />
            <span className="nav-label">Sell</span>
          </NavLink>
          <NavLink to="/wishlist" aria-label="Watchlist" className="gray-icon">
            <i className="fa-solid fa-heart" />
            <span className="nav-label">Saved</span>
          </NavLink>
          <NavLink to="/profile" aria-label="Profile" className="gray-icon">
            <i className="fa-solid fa-user" />
            <span className="nav-label">Profile</span>
          </NavLink>
        </div>
      </nav>
    </>
  );
}
