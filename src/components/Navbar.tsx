import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link to="/" className="brand" onClick={closeMenu}>
          <span className="brand-ball">⚽</span>
          <span>
            <strong>GOAL</strong>
            <b>ZONE</b>
          </span>
        </Link>

        <nav className={open ? "nav-links open" : "nav-links"}>
          <NavLink to="/" end onClick={closeMenu}>
            Home
          </NavLink>

          <NavLink to="/matches" onClick={closeMenu}>
            Matches
          </NavLink>

          <NavLink to="/live" className="live-link" onClick={closeMenu}>
            <i />
            Live
          </NavLink>

          <NavLink to="/transfers" onClick={closeMenu}>
            Transfers
          </NavLink>

          <NavLink to="/news" onClick={closeMenu}>
            News
          </NavLink>

          <NavLink to="/leagues" onClick={closeMenu}>
            Leagues
          </NavLink>

          <NavLink to="/favorites" onClick={closeMenu}>
            Favorites
          </NavLink>
        </nav>

        <div className="nav-actions">
          <Link to="/live" className="live-button">
            <span />
            LIVE
          </Link>

          <button
            className="menu-button"
            type="button"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}