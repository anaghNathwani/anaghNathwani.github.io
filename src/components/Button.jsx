import { Link } from "react-router-dom";
import { useMagnetic } from "../hooks/useMagnetic";
import styles from "./Button.module.css";

/**
 * variant: "primary" | "secondary" | "ghost"
 * size: "sm" | "md" | "lg"
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  type = "button",
  external,
  ...props
}) {
  const cls = [styles.btn, styles[variant], styles[size]].join(" ");
  const ref = useMagnetic(0.25);

  const inner = <span className={styles.inner}>{children}</span>;

  if (href) {
    if (external) {
      return (
        <a
          ref={ref}
          href={href}
          className={cls}
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          {inner}
        </a>
      );
    }
    return (
      <Link ref={ref} to={href} className={cls} {...props}>
        {inner}
      </Link>
    );
  }

  return (
    <button ref={ref} type={type} className={cls} onClick={onClick} {...props}>
      {inner}
    </button>
  );
}
