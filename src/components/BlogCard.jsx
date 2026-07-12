import { useState } from "react";
import Badge from "./Badge";
import { useInView } from "../hooks/useInView";
import styles from "./BlogCard.module.css";

const ExternalIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

function Carousel({ images, title }) {
  const [idx, setIdx] = useState(0);

  const prev = (e) => { e.stopPropagation(); setIdx((i) => (i - 1 + images.length) % images.length); };
  const next = (e) => { e.stopPropagation(); setIdx((i) => (i + 1) % images.length); };

  return (
    <div className={styles.carousel}>
      <img src={images[idx]} alt={`${title} ${idx + 1}`} className={styles.thumbnailImg} />
      <button className={`${styles.carouselBtn} ${styles.carouselPrev}`} onClick={prev} aria-label="Previous">‹</button>
      <button className={`${styles.carouselBtn} ${styles.carouselNext}`} onClick={next} aria-label="Next">›</button>
      <div className={styles.carouselDots}>
        {images.map((_, i) => (
          <span key={i} className={`${styles.dot} ${i === idx ? styles.dotActive : ""}`} onClick={(e) => { e.stopPropagation(); setIdx(i); }} />
        ))}
      </div>
    </div>
  );
}

export default function BlogCard({ activity }) {
  const { title, description, tags, date, emoji, accentColor, link, image, images } = activity;
  const [ref, inView] = useInView();
  const allImages = images ?? (image ? [image] : null);

  return (
    <article ref={ref} className={`${styles.card} reveal-scale ${inView ? "visible" : ""}`}>
      <div className={styles.accent} style={{ background: accentColor, boxShadow: `2px 0 12px ${accentColor}55` }} />
      {allImages && allImages.length > 1 ? (
        <Carousel images={allImages} title={title} />
      ) : allImages?.length === 1 ? (
        <div className={styles.thumbnail}>
          <img src={allImages[0]} alt={title} className={styles.thumbnailImg} />
        </div>
      ) : null}
      <div className={styles.body}>
        <div className={styles.top}>
          <span className={styles.emoji}>{emoji}</span>
          <time className={styles.date}>{date}</time>
        </div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <div className={styles.tags}>
          {tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        {link && (
          <div className={styles.footer}>
            <a href={/^https?:\/\//.test(link) ? link : `https://${link}`} target="_blank" rel="noopener noreferrer" className={styles.link}>
              <ExternalIcon /> Visit
            </a>
          </div>
        )}
      </div>
    </article>
  );
}
