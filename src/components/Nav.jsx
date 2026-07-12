import { NavLink } from "react-router-dom";
import { profile } from "../data/profile";
import styles from "./Nav.module.css";

const links = [
  { to: "/",        label: "Home"     },
  { to: "/projects",label: "Lab"      },
  { to: "/blog",    label: "Notebook" },
  { to: "/about",   label: "About"    },
];

const colorClasses = [styles.c0, styles.c1, styles.c2, styles.c3];

export default function Nav() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <NavLink to="/" className={styles.logo}>
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
      </nav>
    </header>
  );
}
