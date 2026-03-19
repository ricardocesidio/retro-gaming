import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <Link to="/" className="side-item"><i className="fas fa-home"></i></Link>
      <Link to="/messages" className="side-item"><i className="fa-solid fa-message"></i></Link>
      <Link to="/sell" className="side-item"><i className="fa-solid fa-plus"></i></Link>
      <Link to="/profile" className="side-item"><i className="fa-solid fa-user"></i></Link>
      <Link to="/notifications" className="side-item"><i className="fa-solid fa-bell"></i></Link>
    </aside>
  );
}