import { useState, useEffect, useCallback } from "react";
import styles from "./Tour.module.css";

const TOUR_KEY = "anagh_portfolio_tour_v1";

const STEPS = [
  {
    selector: null,
    title: "Welcome",
    body: "I'm Anagh — builder, musician, and curious person. Let me give you a quick tour of the site.",
    position: "center",
  },
  {
    selector: '[data-tour="nav"]',
    title: "Navigation",
    body: "Three sections: Home, Workshop (shipped projects), and Notebook — my living log of experiences.",
    position: "bottom",
    pad: 16,
  },
  {
    selector: '[data-tour="projects"]',
    title: "Featured Work",
    body: "Real shipped projects with GitHub links and live demos. Everything here has users or runs in production.",
    position: "bottom",
    pad: 16,
  },
  {
    selector: '[data-tour="about"]',
    title: "Who I Am",
    body: "Stack, interests, and ways to reach me. I build full-stack apps, do 3D graphics, and play violin.",
    position: "bottom",
    pad: 16,
  },
];

const TOOLTIP_W = 300;

export default function Tour() {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState(null);
  const [ready, setReady] = useState(false);

  const current = STEPS[step];

  // Auto-show on first visit only — mark as seen the moment it appears so a
  // refresh mid-tour (before Skip/Finish is clicked) doesn't retrigger it.
  useEffect(() => {
    if (!localStorage.getItem(TOUR_KEY)) {
      const t = setTimeout(() => {
        setActive(true);
        localStorage.setItem(TOUR_KEY, "1");
      }, 800);
      return () => clearTimeout(t);
    }
  }, []);

  // Scroll to element and measure when step changes
  useEffect(() => {
    if (!active) return;
    setReady(false);
    setRect(null);

    if (!current.selector) {
      setReady(true);
      return;
    }

    const el = document.querySelector(current.selector);
    if (!el) { setReady(true); return; }

    el.scrollIntoView({ behavior: "smooth", block: "center" });

    const t = setTimeout(() => {
      const r = el.getBoundingClientRect();
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height, bottom: r.bottom, right: r.right });
      setReady(true);
    }, 420);

    return () => clearTimeout(t);
  }, [active, step]); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-measure on resize
  const remeasure = useCallback(() => {
    if (!current.selector) return;
    const el = document.querySelector(current.selector);
    if (!el) return;
    const r = el.getBoundingClientRect();
    setRect({ top: r.top, left: r.left, width: r.width, height: r.height, bottom: r.bottom, right: r.right });
  }, [current.selector]);

  useEffect(() => {
    window.addEventListener("resize", remeasure);
    return () => window.removeEventListener("resize", remeasure);
  }, [remeasure]);

  const close = () => {
    setActive(false);
    localStorage.setItem(TOUR_KEY, "1");
  };

  const open = () => {
    setStep(0);
    setActive(true);
  };

  const next = () => (step < STEPS.length - 1 ? setStep((s) => s + 1) : close());
  const prev = () => setStep((s) => s - 1);

  // Compute tooltip position
  const getTooltipStyle = () => {
    if (!rect || current.position === "center") return {};
    const pad = current.pad ?? 16;
    const vw = window.innerWidth;
    // Anchor X = center of the target element
    const anchorX = rect.left + rect.width / 2;
    // Clamp so tooltip stays on screen
    const left = Math.min(Math.max(anchorX - TOOLTIP_W / 2, 12), vw - TOOLTIP_W - 12);

    if (current.position === "bottom") {
      return { top: rect.bottom + pad, left };
    }
    if (current.position === "top") {
      return { bottom: window.innerHeight - rect.top + pad, left };
    }
    return {};
  };

  const tooltipStyle = getTooltipStyle();

  return (
    <>
      {/* Floating trigger */}
      {!active && (
        <button className={styles.trigger} onClick={open} aria-label="Open site guide">
          <span>?</span>
        </button>
      )}

      {active && ready && (
        <>
          {/* Spotlight overlay — four panels leave a hole over the target */}
          {rect ? (
            <>
              <div className={styles.panel} style={{ top: 0, left: 0, right: 0, height: Math.max(0, rect.top) }} />
              <div className={styles.panel} style={{ top: rect.bottom, left: 0, right: 0, bottom: 0 }} />
              <div className={styles.panel} style={{ top: rect.top, left: 0, width: Math.max(0, rect.left), height: rect.height }} />
              <div className={styles.panel} style={{ top: rect.top, left: rect.right, right: 0, height: rect.height }} />
              <div className={styles.spotlight} style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height }} />
            </>
          ) : (
            <div className={styles.overlay} />
          )}

          {/* Tooltip */}
          <div
            className={[
              styles.tooltip,
              current.position === "center" ? styles.center : "",
            ].filter(Boolean).join(" ")}
            style={tooltipStyle}
          >
            <div className={styles.stepCount}>{step + 1} / {STEPS.length}</div>
            <h3 className={styles.title}>{current.title}</h3>
            <p className={styles.body}>{current.body}</p>

            <div className={styles.actions}>
              <button className={styles.skip} onClick={close}>
                {step === STEPS.length - 1 ? "Done" : "Skip tour"}
              </button>
              <div className={styles.navBtns}>
                {step > 0 && (
                  <button className={styles.prev} onClick={prev}>← Back</button>
                )}
                <button className={styles.next} onClick={next}>
                  {step === STEPS.length - 1 ? "Finish ✓" : "Next →"}
                </button>
              </div>
            </div>

            <div className={styles.dots}>
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  className={[styles.dot, i === step ? styles.dotActive : ""].filter(Boolean).join(" ")}
                  onClick={() => setStep(i)}
                  aria-label={`Step ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
