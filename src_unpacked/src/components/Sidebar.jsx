import { Link, useLocation } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Sidebar.css';

const NAV_ITEMS = [
  { to: '/',             icon: 'fas fa-home',         label: 'Home' },
  { to: '/market',       icon: 'fa-solid fa-store',   label: 'Market' },
  { to: '/sell',         icon: 'fa-solid fa-plus',    label: 'Sell' },
  { to: '/messages',     icon: 'fa-solid fa-message', label: 'Messages' },
  { to: '/profile',      icon: 'fa-solid fa-user',    label: 'Profile' },
  { to: '/notifications',icon: 'fa-solid fa-bell',    label: 'Alerts' },
];

export default function Sidebar() {
  const { pathname } = useLocation();

  const isActive = (to) => {
    if (to === '/') return pathname === '/';
    return pathname.startsWith(to);
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sidebar" aria-label="Main navigation">
        {NAV_ITEMS.map(({ to, icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`side-item ${isActive(to) ? 'active' : ''}`}
            title={label}
            aria-label={label}
          >
            <i className={icon} />
          </Link>
        ))}
      </aside>

      {/* Mobile bottom nav (visible below 768px) */}
      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        {NAV_ITEMS.map(({ to, icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`mobile-nav-item ${isActive(to) ? 'active' : ''}`}
            aria-label={label}
          >
            <i className={icon} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}