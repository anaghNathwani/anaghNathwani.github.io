import { useState, useMemo } from "react";
import PageLayout from "../components/PageLayout";
import BlogCard from "../components/BlogCard";
import { activities } from "../data/blog";
import styles from "./Blog.module.css";

const allTags = ["All", ...new Set(activities.flatMap((a) => a.tags))];

const tagSubtitles = {
  "All": "A collection of experiences, passions, and moments of discovery.",
  "Straight Up Unreal": "Proof that the real world is wilder than fiction.",
  "Violin": "Music, performances, and the journey of learning an instrument.",
  "Milestones": "The experiences that shaped how I think and who I am.",
};

const monthOrder = {
  Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
  Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
  Winter: 1,
};

function parseDate(dateStr) {
  if (!dateStr || dateStr.startsWith("~")) return 0;
  const parts = dateStr.trim().split(" ");
  if (parts.length === 2) {
    const month = monthOrder[parts[0]] ?? 0;
    const year = parseInt(parts[1], 10) || 0;
    return year * 100 + month;
  }
  return parseInt(parts[0], 10) * 100 || 0;
}

export default function Blog() {
  const [activeTag, setActiveTag] = useState("All");
  const [sortDir, setSortDir] = useState("desc");

  const filtered = useMemo(() => {
    const base =
      activeTag === "All"
        ? activities
        : activities.filter((a) => a.tags.includes(activeTag));

    return [...base].sort((a, b) => {
      const diff = parseDate(a.date) - parseDate(b.date);
      return sortDir === "desc" ? -diff : diff;
    });
  }, [activeTag, sortDir]);

  return (
    <PageLayout>
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={[styles.title, activeTag !== "All" ? styles.titleFiltered : ""].join(" ")}>Notebook</h1>
          <p className={[styles.subtitle, activeTag !== "All" ? styles.subtitleFiltered : ""].join(" ")}>
            {tagSubtitles[activeTag] ?? `Everything tagged "${activeTag}".`}
          </p>
        </div>

        <div className={styles.filters}>
          {allTags.map((tag) => (
            <button
              key={tag}
              className={[
                styles.filterBtn,
                activeTag === tag ? styles.filterActive : "",
              ].join(" ")}
              onClick={() => setActiveTag(tag)}
            >
              {tag}
            </button>
          ))}
          <button
            className={styles.filterBtn}
            onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
            title="Toggle date sort"
          >
            {sortDir === "desc" ? "Newest first" : "Oldest first"}
          </button>
        </div>

        <div className={styles.grid}>
          {filtered.map((activity) => (
            <BlogCard key={activity.id} activity={activity} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className={styles.empty}>Nothing here yet for that tag.</p>
        )}
      </div>
    </PageLayout>
  );
}
