// Decorative layer for spooky mode: bats crossing the screen and fog along the bottom
const bats = [
  { top: "14%", duration: "19s", delay: "0s", scale: 1 },
  { top: "24%", duration: "26s", delay: "-9s", scale: 0.6 },
  { top: "9%", duration: "32s", delay: "-20s", scale: 0.45 },
  { top: "36%", duration: "23s", delay: "-14s", scale: 0.8 },
  { top: "18%", duration: "38s", delay: "-4s", scale: 0.35 },
];

const SpookyAmbience = () => (
  <div className="fixed inset-0 z-[44] pointer-events-none overflow-hidden" aria-hidden="true">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(20,0,35,0.55)_100%)]" />
    <div className="fog" />
    {bats.map((bat, i) => (
      <div
        key={i}
        className="bat"
        style={{ top: bat.top, "--bat-duration": bat.duration, "--bat-delay": bat.delay, "--bat-scale": bat.scale }}
      >
        <svg viewBox="0 0 64 28" className="w-12 h-6 fill-black/80 drop-shadow-[0_0_6px_rgba(168,85,247,0.6)]">
          <path d="M32 10c-2-4-3-6-3-8l-2 3c-3-1-6 0-8 2-4-3-10-5-19-3 5 2 8 6 9 11 3-2 7-2 10 1 2-2 5-3 8-1l5 4 5-4c3-2 6-1 8 1 3-3 7-3 10-1 1-5 4-9 9-11-9-2-15 0-19 3-2-2-5-3-8-2l-2-3c0 2-1 4-3 8Z" />
        </svg>
      </div>
    ))}
  </div>
);

export default SpookyAmbience;
