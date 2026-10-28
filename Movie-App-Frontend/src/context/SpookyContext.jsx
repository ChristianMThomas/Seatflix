import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Jumpscare from "../components/Jumpscare";
import Possession from "../components/Possession";
import SpookyAmbience from "../components/SpookyAmbience";
import { preloadScares, randomScare } from "../jumpscares";

// Background track in public/audio/ (jumpscare assets are listed in src/jumpscares.js)
const MUSIC_SRC = "/audio/horrorambiance3.mp3";

// Jumpscares are switched off site-wide: no timer, no toggle button, and the possession only turns
// on the theme and music. Flip to true to bring them back.
const JUMPSCARES_ENABLED = false;

const STORAGE_KEY = "seatflix-spooky";
const MUSIC_VOLUME = 0.35;
// Seconds between jumpscares, picked at random within this range
// TEMP: cranked to ~30s for testing; normal range is 45-150
const SCARE_MIN_DELAY = 25;
const SCARE_MAX_DELAY = 35;
// Before a scare the music fades out and the silence holds for a beat, so the scream lands harder
const SILENCE_FADE_MS = 1500;
const SILENCE_HOLD_MS = 900;
// Spooky mode won't stay off: after this long without it the site takes the mouse and turns it
// back on, and switching it off yourself provokes it almost immediately
const POSSESS_IDLE_MS = 150 * 1000;
const POSSESS_REVOLT_MS = 2500;

const SpookyContext = createContext(null);

// Last known pointer position, so the possessed cursor starts where the real one was
let lastPointer = null;

const loadSettings = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return { spooky: !!saved?.spooky, music: !!saved?.music, scares: !!saved?.scares };
  } catch {
    return { spooky: false, music: false, scares: false };
  }
};

export const SpookyProvider = ({ children }) => {
  const [settings, setSettings] = useState(loadSettings);
  const [musicMissing, setMusicMissing] = useState(false);
  const [scaring, setScaring] = useState(null);
  const [possessed, setPossessed] = useState(null);
  const musicRef = useRef(null);
  const fadeRef = useRef(null);
  const turnedOffRef = useRef(false);

  // Nothing spooky while a movie or show is playing; settings are kept for when the user leaves
  const suppressed = useLocation().pathname.toLowerCase().startsWith("/watch");
  const spooky = settings.spooky && !suppressed;
  const music = settings.music && !suppressed;
  const scares = JUMPSCARES_ENABLED && settings.scares && !suppressed;

  const fadeMusic = useCallback((to, ms) => {
    clearInterval(fadeRef.current);
    const audio = musicRef.current;
    if (!audio) return;
    const from = audio.volume;
    const steps = Math.max(1, Math.round(ms / 50));
    let step = 0;
    fadeRef.current = setInterval(() => {
      step++;
      audio.volume = from + (to - from) * (step / steps);
      if (step >= steps) clearInterval(fadeRef.current);
    }, 50);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Storage unavailable (private mode); settings just won't persist
    }
  }, [settings]);

  useEffect(() => {
    const root = document.documentElement;
    if (spooky) root.dataset.theme = "halloween";
    else delete root.dataset.theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", spooky ? "#08050c" : "#07070b");
  }, [spooky]);

  // Background music. Browsers block audio until the user interacts with the page, so after a
  // reload with music on we wait for the first click or key press before starting it.
  useEffect(() => {
    if (!music) {
      musicRef.current?.pause();
      return;
    }

    if (!musicRef.current) {
      const audio = new Audio(MUSIC_SRC);
      audio.loop = true;
      audio.volume = MUSIC_VOLUME;
      audio.addEventListener("error", () => {
        console.warn(`Spooky music not found. Add an audio file at public${MUSIC_SRC}`);
        setMusicMissing(true);
      });
      musicRef.current = audio;
    }

    const audio = musicRef.current;
    const start = () => audio.play().catch(() => {});
    const events = ["pointerdown", "keydown"];
    audio.play().catch(() => events.forEach((e) => window.addEventListener(e, start, { once: true })));

    return () => {
      events.forEach((e) => window.removeEventListener(e, start));
      audio.pause();
    };
  }, [music]);

  // Jumpscares on a random timer. Skipped while the tab is hidden or something is fullscreen
  // (an overlay can't show over a fullscreen video anyway).
  useEffect(() => {
    if (!scares || scaring) return;

    let timer;
    const schedule = () => {
      const delay = SCARE_MIN_DELAY + Math.random() * (SCARE_MAX_DELAY - SCARE_MIN_DELAY);
      timer = setTimeout(() => {
        if (document.hidden || document.fullscreenElement) return schedule();
        // The calm before the scare: let the music die away, hold the silence, then strike
        fadeMusic(0, SILENCE_FADE_MS);
        timer = setTimeout(() => setScaring(randomScare()), SILENCE_FADE_MS + SILENCE_HOLD_MS);
      }, delay * 1000);
    };
    schedule();

    return () => clearTimeout(timer);
  }, [scares, scaring, fadeMusic]);

  // Have the image and sound ready so the scare hits on the first frame; if scares are switched
  // off mid-fade, bring the music back
  useEffect(() => {
    if (scares) preloadScares();
    else fadeMusic(MUSIC_VOLUME, 800);
  }, [scares, fadeMusic]);

  useEffect(() => {
    const track = (e) => {
      lastPointer = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("pointermove", track, { passive: true });
    return () => window.removeEventListener("pointermove", track);
  }, []);

  // Possession timer: runs whenever any part of spooky mode is off outside the watch page
  const fullyOn = spooky && music && (scares || !JUMPSCARES_ENABLED);
  useEffect(() => {
    if (suppressed || fullyOn || possessed) return;
    const delay = turnedOffRef.current ? POSSESS_REVOLT_MS : POSSESS_IDLE_MS;
    turnedOffRef.current = false;
    const timer = setTimeout(() => setPossessed({ from: lastPointer }), delay);
    return () => clearTimeout(timer);
  }, [suppressed, fullyOn, possessed]);

  // Turning spooky mode off also silences the music and stops the scares. Switching any of them
  // off flags it so the possession comes for the user right away.
  const toggleSpooky = useCallback(() => {
    if (spooky) turnedOffRef.current = true;
    setSettings((s) => (s.spooky ? { spooky: false, music: false, scares: false } : { ...s, spooky: true }));
  }, [spooky]);
  const toggleMusic = useCallback(() => {
    if (music) turnedOffRef.current = true;
    setSettings((s) => ({ ...s, music: !s.music }));
  }, [music]);
  const toggleScares = useCallback(() => {
    if (scares) turnedOffRef.current = true;
    setSettings((s) => ({ ...s, scares: !s.scares }));
  }, [scares]);
  const endPossession = useCallback(() => setPossessed(null), []);
  const endScare = useCallback(() => {
    setScaring(null);
    fadeMusic(MUSIC_VOLUME, 3000);
  }, [fadeMusic]);

  return (
    <SpookyContext.Provider
      value={{ spooky, music, scares, scaresEnabled: JUMPSCARES_ENABLED, musicMissing, suppressed, toggleSpooky, toggleMusic, toggleScares }}
    >
      {children}
      {spooky && <SpookyAmbience />}
      {scaring && !suppressed && <Jumpscare scare={scaring} onDone={endScare} />}
      {possessed && !suppressed && <Possession from={possessed.from} onDone={endPossession} />}
    </SpookyContext.Provider>
  );
};

export const useSpooky = () => useContext(SpookyContext);
