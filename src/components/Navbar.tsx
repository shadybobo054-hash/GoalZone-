import { NavLink } from "react-router-dom";
import Logo from "../Logo";
import "./Navbar.css";

export default function Navbar() {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `nav-link ${isActive ? "active" : ""}`;

  return (
    <header className="navbar">
      <div className="navbar-inner">

        <NavLink to="/" className="navbar-logo">
          <Logo />
        </NavLink>

        <nav className="navbar-links">

          <NavLink to="/" className={navClass}>
            Home
          </NavLink>

          <NavLink to="/matches" className={navClass}>
            Matches
          </NavLink>

          <NavLink
            to="/live"
            className={({ isActive }) =>
              `nav-link live-link ${isActive ? "active" : ""}`
            }
          >
            <span className="live-dot" />
            Live
          </NavLink>

          <NavLink to="/transfers" className={navClass}>
            Transfers
          </NavLink>

          <NavLink to="/news" className={navClass}>
            News
          </NavLink>

        </nav>

        <div className="navbar-actions">

          <button
            type="button"
            className="notification-btn"
            aria-label="Notifications"
          >
            🔔
            <span className="notification-badge">3</span>
          </button>

          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `favorites-btn ${isActive ? "active" : ""}`
            }
            aria-label="Favorites"
          >
            ♡
          </NavLink>

          <div className="stadium-status">
            <span className="status-light" />
            <span>ONLINE</span>
          </div>

        </div>

      </div>

      <div className="navbar-line" />
    </header>
  );
}