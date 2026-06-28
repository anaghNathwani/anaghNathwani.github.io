import { useState } from "react";
import PageLayout from "../components/PageLayout";
import ProjectCard from "../components/ProjectCard";
import { projects } from "../data/projects";
import styles from "./Projects.module.css";

const allTags = ["All", ...new Set(projects.flatMap((p) => p.tags))];

export default function Projects() {
  const [activeTag, setActiveTag] = useState("All");

  const filtered =
    activeTag === "All"
      ? projects
      : projects.filter((p) => p.tags.includes(activeTag));

  return (
    <PageLayout>
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Things I've Built</h1>
          <p className={styles.subtitle}>
            From quick experiments to real-world apps — everything I've made, shipped, or learned from.
          </p>
        </div>

        <div className={styles.filters}>
          {allTags.map((tag) => (
            <button
              key={tag}
              className={[styles.filterBtn, activeTag === tag ? styles.filterActive : ""].join(" ")}
              onClick={() => setActiveTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className={styles.empty}>No projects match that filter.</p>
        )}
      </div>
    </PageLayout>
  );
}
