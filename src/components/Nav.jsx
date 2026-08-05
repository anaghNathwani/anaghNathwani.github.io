import { NavLink, useLocation } from "react-router-dom";
import { profile } from "../data/profile";
import { useTheme } from "../hooks/useTheme";
import { useMusic } from "../hooks/useMusic";
import styles from "./Nav.module.css";

const links = [
  { to: "/",        label: "Home"     },
  { to: "/projects",label: "Workshop"      },
  { to: "/blog",    label: "Notebook" },
];

const colorClasses = [styles.c0, styles.c1, styles.c2, styles.c3];

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.4M12 19.1v2.4M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.9 19.1l1.7-1.7M17.4 6.6l1.7-1.7" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.6 15.1a8.7 8.7 0 0 1-11-11.2A9.2 9.2 0 1 0 20.6 15.1Z" />
    </svg>
  );
}

function MusicOnIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 15V6.6a1 1 0 0 1 .8-1L15 4v11" />
      <circle cx="12.5" cy="15" r="2.5" />
      <circle cx="4.5" cy="17" r="2.3" />
      <path d="M18.2 8.2a4 4 0 0 1 0 6" />
    </svg>
  );
}

function MusicOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 15V6.6a1 1 0 0 1 .8-1L15 4v11" />
      <circle cx="4.5" cy="17" r="2.3" />
      <line x1="17" y1="6" x2="22" y2="16" />
      <line x1="22" y1="6" x2="17" y2="16" />
    </svg>
  );
}

export default function Nav() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const { theme, toggleTheme } = useTheme();
  const { musicOn, toggleMusic } = useMusic();

  return (
    <header className={styles.header}>
      <nav className={styles.nav} data-tour="nav">
        <NavLink
          to="/"
          className={styles.logo}
          style={{ display: isHome ? "none" : undefined }}
        >
          {profile.name}
        </NavLink>
        <ul className={styles.links}>
          {links.map(({ to, label }, i) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  [styles.link, colorClasses[i], isActive ? styles.active : ""].join(" ")
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className={styles.toggles}>
          <button
            type="button"
            className={styles.toggleBtn}
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            type="button"
            className={[styles.toggleBtn, musicOn ? styles.musicOn : ""].join(" ")}
            onClick={toggleMusic}
            aria-label={musicOn ? "Mute background music" : "Play background music"}
            title={musicOn ? "Mute background music" : "Play background music"}
          >
            {musicOn ? <MusicOnIcon /> : <MusicOffIcon />}
          </button>
        </div>
      </nav>
    </header>
  );
}
