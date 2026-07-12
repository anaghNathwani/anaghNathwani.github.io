import styles from "./Section.module.css";

export default function Section({ title, subtitle, children, id, num }) {
  return (
    <section className={styles.section} id={id}>
      {num && <span className={styles.num} aria-hidden>{num}</span>}
      {title && (
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      )}
      {children}
    </section>
  );
}
