import { useEffect, useState } from "react";
import { useAmbientMusic } from "../hooks/useAmbientMusic";
import { MusicContext, MUSIC_STORAGE_KEY } from "./music-context";

function getInitialMusic() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(MUSIC_STORAGE_KEY) === "on";
}

export function MusicProvider({ children }) {
  const [musicOn, setMusicOn] = useState(getInitialMusic);
  const [unlocked, setUnlocked] = useState(false);

  useAmbientMusic(musicOn && unlocked);

  useEffect(() => {
    window.localStorage.setItem(MUSIC_STORAGE_KEY, musicOn ? "on" : "off");
  }, [musicOn]);

  // Browsers block audio until a user gesture. If the visitor's saved
  // preference is "on", start on the first click/keypress instead of
  // silently failing to play.
  useEffect(() => {
    if (unlocked) return;
    const unlock = () => setUnlocked(true);
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [unlocked]);

  const toggleMusic = () => {
    setUnlocked(true);
    setMusicOn((v) => !v);
  };

  return (
    <MusicContext.Provider value={{ musicOn, toggleMusic }}>
      {children}
    </MusicContext.Provider>
  );
}
