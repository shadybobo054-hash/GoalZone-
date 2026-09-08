import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="navbar">

      {/* LOGO */}
      <Link to="/" className="nav-logo">
        <div className="nav-logo-box">
          <span>⚽</span>
        </div>

        <div className="nav-brand">
          <div>
            <strong>GOAL</strong>
            <em>ZONE</em>
          </div>

          <small>FOOTBALL MEDIA</small>
        </div>
      </Link>

      {/* NAVIGATION */}
      <nav className="nav-links">

        <NavLink to="/" end>
          <span className="nav-icon">⌂</span>
          <span>Home</span>
        </NavLink>

        <NavLink to="/matches">
          <span className="nav-icon">◉</span>
          <span>Matches</span>
        </NavLink>

        <NavLink to="/live" className="live-link">
          <span className="live-dot"></span>
          <span>Live</span>
        </NavLink>

        <NavLink to="/leagues">
          <span className="nav-icon">🏆</span>
          <span>Leagues</span>
        </NavLink>

        <NavLink to="/transfers">
          <span className="nav-icon">⇄</span>
          <span>Transfers</span>
        </NavLink>

        <NavLink to="/news">
          <span className="nav-icon">▤</span>
          <span>News</span>
        </NavLink>

        <NavLink to="/favorites">
          <span className="nav-icon">♡</span>
          <span>Favorites</span>
        </NavLink>

      </nav>

      {/* ACTIONS */}
      <div className="nav-actions">

        <button
          className="notification"
          aria-label="Notifications"
        >
          <span>♢</span>
          <i></i>
        </button>

        <Link
          to="/live"
          className="live-button"
        >
          <span className="live-button-dot"></span>
          LIVE
        </Link>

      </div>

    </header>
  );
}