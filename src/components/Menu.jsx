import { Link } from "react-router-dom";

export default function Menu() {
  return (
    <nav className="category-bar" aria-label="Category navigation">
      <div className="nav-links">
        <Link to="/" title="Home"><i className="fa-solid fa-home" /></Link>
        <Link to="/consoles" title="Consoles" className="gray-icon"><i className="fa-solid fa-gamepad" /></Link>
        <Link to="/games" title="Games" className="gray-icon"><i className="fa-solid fa-compact-disc" /></Link>
        <Link to="/sell" className="sell-highlight" title="Sell"><i className="fa-solid fa-plus" /></Link>
        <Link to="/collectibles" title="Collectibles" className="gray-icon"><i className="fa-solid fa-star" /></Link>
        <Link to="/arcade" title="Arcade" className="gray-icon"><i className="fa-solid fa-rocket" /></Link>
        <Link to="/auction" className="auction-icon" title="Auction"><i className="fa-solid fa-gavel" /></Link>
      </div>
    </nav>
  );
}
