import { useEffect, useRef } from "react";

// Low, slow-moving pad chord (Am9-ish) — kept quiet and unobtrusive.
const NOTES = [110.0, 130.81, 164.81, 196.0, 246.94];
const MASTER_LEVEL = 0.055;
const FADE_SECONDS = 1.4;

/**
 * Builds a small generative ambient drone entirely with the Web Audio API,
 * so the toggle works with no bundled audio asset or third-party service.
 */
function buildEngine() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();

  const master = ctx.createGain();
  master.gain.value = 0;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 900;
  filter.Q.value = 0.3;

  // Cheap feedback-delay "reverb" — no impulse-response file needed.
  const delay = ctx.createDelay(2);
  delay.delayTime.value = 0.55;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.35;
  const wet = ctx.createGain();
  wet.gain.value = 0.5;

  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(wet);
  wet.connect(filter);

  filter.connect(master);
  master.connect(ctx.destination);

  const voices = NOTES.map((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = i % 2 === 0 ? "sine" : "triangle";
    osc.frequency.value = freq;
    osc.detune.value = (Math.random() - 0.5) * 6;

    const voiceGain = ctx.createGain();
    voiceGain.gain.value = 0.7 / NOTES.length;

    // Slow LFO per voice so the pad breathes instead of droning flatly.
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.04 + Math.random() * 0.05;
    const lfoDepth = ctx.createGain();
    lfoDepth.gain.value = 0.5 / NOTES.length;
    lfo.connect(lfoDepth);
    lfoDepth.connect(voiceGain.gain);

    osc.connect(voiceGain);
    voiceGain.connect(filter);
    voiceGain.connect(delay);

    osc.start();
    lfo.start();

    return { osc, lfo };
  });

  return { ctx, master, voices };
}

export function useAmbientMusic(enabled) {
  const engineRef = useRef(null);
  const fadeOutTimer = useRef(null);

  useEffect(() => {
    return () => {
      clearTimeout(fadeOutTimer.current);
      const engine = engineRef.current;
      if (engine) {
        engine.voices.forEach(({ osc, lfo }) => {
          osc.stop();
          lfo.stop();
        });
        engine.ctx.close();
      }
    };
  }, []);

  useEffect(() => {
    clearTimeout(fadeOutTimer.current);

    if (enabled) {
      if (!engineRef.current) {
        engineRef.current = buildEngine();
      }
      const { ctx, master } = engineRef.current;
      if (ctx.state === "suspended") ctx.resume();
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(MASTER_LEVEL, now + FADE_SECONDS);
    } else if (engineRef.current) {
      const { ctx, master } = engineRef.current;
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0, now + FADE_SECONDS);
      fadeOutTimer.current = setTimeout(() => {
        if (ctx.state !== "closed") ctx.suspend();
      }, FADE_SECONDS * 1000 + 100);
    }
  }, [enabled]);
}
