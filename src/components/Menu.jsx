import { NavLink } from "react-router-dom";

export default function Menu() {
  return (
    <nav className="category-bar" aria-label="Category navigation">
      <div className="nav-links">
        <NavLink to="/" end aria-label="Home"><i className="fa-solid fa-home" /></NavLink>
        <NavLink to="/consoles" aria-label="Consoles" className="gray-icon"><i className="fa-solid fa-gamepad" /></NavLink>
        <NavLink to="/games" aria-label="Games" className="gray-icon"><i className="fa-solid fa-compact-disc" /></NavLink>
        <NavLink to="/sell" className="sell-highlight" aria-label="Sell"><i className="fa-solid fa-plus" /></NavLink>
        <NavLink to="/collectibles" aria-label="Collectibles" className="gray-icon"><i className="fa-solid fa-star" /></NavLink>
        <NavLink to="/arcade" aria-label="Arcade" className="gray-icon"><i className="fa-solid fa-rocket" /></NavLink>
        <NavLink to="/auction" className="auction-icon" aria-label="Auction"><i className="fa-solid fa-gavel" /></NavLink>
        <NavLink to="/wallet" aria-label="Wallet" className="gray-icon"><i className="fa-solid fa-wallet" /></NavLink>
      </div>
    </nav>
  );
}
