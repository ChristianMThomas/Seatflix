import { useEffect, useRef, useState } from "react";

// The switches it turns on, in order (matched by data-spooky-toggle in SpookyControls)
const SWITCHES = ["theme", "music", "scares"];
// How long the stolen cursor takes to crawl over to the first switch, then hop to each next one
const TRAVEL_MS = 2800;
const HOP_MS = 700;
// Beat after each click so the user sees it land
const CLICK_PAUSE_MS = 450;
// How long "LET GO" keeps strobing after the user stops fighting
const LET_GO_MS = 650;
// Pixels of real mouse movement that count as fighting back
const FIGHT_THRESHOLD = 3;

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// The site takes the mouse: the real cursor vanishes, a fake one drifts over to the spooky
// switches on its own and clicks every one that's off. Moving the real mouse makes the fake one thrash and flashes "LET GO".
const Possession = ({ from, onDone }) => {
  const cursorRef = useRef(null);
  const [pressed, setPressed] = useState(false);
  const [fighting, setFighting] = useState(false);

  useEffect(() => {
    const find = (name) => document.querySelector(`[data-spooky-toggle="${name}"]`);
    if (!find(SWITCHES[0]) || document.hidden) {
      onDone();
      return;
    }

    let pos = from ?? { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let frame, letGoTimer, pressTimer, doneTimer;
    let index = 0;
    let leg = null; // { target, from, start, duration } for the trip to the current switch
    let resumeAt = 0;
    let struggle = 0;
    let last = null;

    const place = (x, y) => {
      cursorRef.current.style.transform = `translate(${x + (Math.random() - 0.5) * struggle}px, ${y + (Math.random() - 0.5) * struggle}px)`;
      struggle *= 0.9;
    };

    const step = (now) => {
      frame = requestAnimationFrame(step);
      if (now < resumeAt) return place(pos.x, pos.y);

      if (!leg) {
        // The music and scare buttons only appear once the theme is on; skip any already switched on
        const target = find(SWITCHES[index]);
        if (!target || target.getAttribute("aria-pressed") === "true") {
          if (++index >= SWITCHES.length) {
            cancelAnimationFrame(frame);
            doneTimer = setTimeout(onDone, 700);
          }
          return place(pos.x, pos.y);
        }
        leg = { target, from: pos, start: now, duration: index === 0 ? TRAVEL_MS : HOP_MS };
      }

      const t = Math.min(1, (now - leg.start) / leg.duration);
      const k = easeInOut(t);
      const rect = leg.target.getBoundingClientRect();
      const tx = rect.left + rect.width / 2;
      const ty = rect.top + rect.height / 2;

      // Wander off the straight line like something else is steering, settling as it closes in
      const wander = Math.sin(t * Math.PI) * (index === 0 ? 1 : 0.4);
      pos = {
        x: leg.from.x + (tx - leg.from.x) * k + (Math.sin(now / 90) * 18 + Math.sin(now / 37) * 4) * wander,
        y: leg.from.y + (ty - leg.from.y) * k + Math.cos(now / 130) * 14 * wander,
      };
      place(pos.x, pos.y);

      if (t >= 1) {
        setPressed(true);
        pressTimer = setTimeout(() => setPressed(false), 160);
        leg.target.click();
        leg = null;
        index++;
        resumeAt = now + CLICK_PAUSE_MS;
        if (index >= SWITCHES.length) {
          cancelAnimationFrame(frame);
          doneTimer = setTimeout(onDone, 900);
        }
      }
    };
    frame = requestAnimationFrame(step);

    const onMove = (e) => {
      const moved = last ? Math.hypot(e.clientX - last.x, e.clientY - last.y) : 0;
      last = { x: e.clientX, y: e.clientY };
      if (moved < FIGHT_THRESHOLD) return;
      struggle = 45;
      setFighting(true);
      clearTimeout(letGoTimer);
      letGoTimer = setTimeout(() => setFighting(false), LET_GO_MS);
    };
    window.addEventListener("pointermove", onMove);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(letGoTimer);
      clearTimeout(pressTimer);
      clearTimeout(doneTimer);
      window.removeEventListener("pointermove", onMove);
    };
  }, [from, onDone]);

  return (
    // Full-screen shield hides the real cursor and swallows clicks while the site has control
    <div className="fixed inset-0 z-[200] cursor-none select-none" role="presentation" onClickCapture={(e) => e.preventDefault()}>
      {fighting && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
          <p className="let-go">LET GO</p>
        </div>
      )}
      <div ref={cursorRef} className="absolute top-0 left-0 pointer-events-none will-change-transform" aria-hidden="true">
        <svg
          viewBox="0 0 16 24"
          className={`w-[18px] h-[27px] origin-top-left transition-transform duration-150 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] ${pressed ? "scale-75" : ""}`}
        >
          <path d="M1 1v19l4.6-4.4 3 7 3-1.3-3-6.9H15Z" fill="#fff" stroke="#000" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};

export default Possession;
