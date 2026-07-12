import { Link } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import Section from "../components/Section";
import Badge from "../components/Badge";
import Button from "../components/Button";
import HeroScene from "../components/HeroScene";
import { profile } from "../data/profile";
import { projects } from "../data/projects";
import styles from "./Home.module.css";

const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export default function Home() {
  const featured = projects.filter((p) => p.featured);

  return (
    <PageLayout>
      {/* ── Hero ── */}
      <div className={styles.hero}>
        <HeroScene />
        <div className={styles.heroDots} aria-hidden />
        <div className={styles.heroGlow} aria-hidden />
        <div className={styles.heroInner}>
          <p className={styles.greeting}>Hey, I&apos;m</p>
          <h1 className={styles.name}>
            <span className={styles.nameBold}>{profile.name}</span>
          </h1>
          <div className={styles.ctas}>
            <Button href="/projects" size="lg">
              View my work <ArrowRight />
            </Button>
            <Button href={`mailto:${profile.email}`} variant="secondary" size="lg">
              Get in touch
            </Button>
          </div>
        </div>
      </div>

      {/* ── Featured Projects ── */}
      <Section title="Featured Projects" id="projects">
        <div className={styles.featuredList}>
          {featured.map((project, i) => (
            <div key={project.id} className={styles.featuredItem} style={{ '--accent-color': project.accentColor }}>
              <span className={styles.featuredIndex}>0{i + 1}</span>
              <div className={styles.featuredBody}>
                <h3 className={styles.featuredTitle}>{project.title}</h3>
                <p className={styles.featuredDesc}>{project.description}</p>
                <div className={styles.featuredMeta}>
                  <div className={styles.featuredTags}>
                    {project.tags.map(t => <Badge key={t}>{t}</Badge>)}
                  </div>
                  <div className={styles.featuredLinks}>
                    {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer" className={styles.featuredLink}>GitHub →</a>}
                    {project.live && <a href={project.live} target="_blank" rel="noopener noreferrer" className={styles.featuredLink}>Live →</a>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.allLink}>
          <Link to="/projects" className={styles.viewAll}>
            View all projects <ArrowRight />
          </Link>
        </div>
      </Section>

      {/* ── About Snippet ── */}
      <Section title="About Me" id="about">
        <div className={styles.aboutSnippet}>
          <div className={styles.aboutText}>
            <p className={styles.bio}>{profile.bio}</p>
            <div className={styles.aboutCtas}>
              <Button href="/about" variant="secondary">
                More about me <ArrowRight />
              </Button>
              <Button href={profile.github} variant="ghost" external>
                GitHub
              </Button>
            </div>
          </div>
          <div className={styles.quickSkills}>
            {profile.skills.map((group) => (
              <div key={group.category} className={styles.skillGroup}>
                <span className={styles.skillCategory}>{group.category}</span>
                <span className={styles.skillItems}>{group.items.join(", ")}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
