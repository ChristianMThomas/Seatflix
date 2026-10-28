import { useSpooky } from "../context/SpookyContext";

const Pumpkin = ({ lit }) => (
  <svg viewBox="0 0 32 32" className={`w-6 h-6 transition-all duration-500 ${lit ? "drop-shadow-[0_0_8px_rgba(255,140,30,0.9)]" : "grayscale opacity-70"}`} aria-hidden="true">
    <path d="M16 7c0-2 1-4 3-5" stroke="#4d7c0f" strokeWidth="2.4" strokeLinecap="round" fill="none" />
    <path d="M19 4c2-1 4 0 5 1-2 1-4 1-5-1Z" fill="#65a30d" />
    <ellipse cx="9.5" cy="18" rx="7" ry="10" fill="#e8590c" />
    <ellipse cx="22.5" cy="18" rx="7" ry="10" fill="#e8590c" />
    <ellipse cx="16" cy="18" rx="8" ry="11" fill="#fd7e14" />
    <path d="M16 7.5v21" stroke="#c2410c" strokeWidth="0.8" opacity="0.6" />
    {lit ? (
      <g fill="#fde047" className="animate-flicker">
        <path d="M8 15l4-3 1.5 4.5Z" />
        <path d="M24 15l-4-3-1.5 4.5Z" />
        <path d="M15 18.5l1-2 1 2Z" />
        <path d="M8 21c3 4 13 4 16 0l-2.5 1-1.5-1.5-2 1.5-2-1.5-2 1.5-2-1.5-1.5 1.5Z" />
      </g>
    ) : (
      <g fill="#7c2d12" opacity="0.5">
        <path d="M8 15l4-3 1.5 4.5Z" />
        <path d="M24 15l-4-3-1.5 4.5Z" />
        <path d="M9 22h14" stroke="#7c2d12" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    )}
  </svg>
);

const Slash = () => <path strokeLinecap="round" d="M4 4l16 16" />;

const SpookyControls = () => {
  const { spooky, music, scares, scaresEnabled, musicMissing, suppressed, toggleSpooky, toggleMusic, toggleScares } = useSpooky();
  if (suppressed) return null;

  const toggleClass = (on) =>
    `btn-icon w-10 h-10 animate-fade-in ${on ? "text-brand border-brand/50 bg-brand/15 hover:bg-brand/25" : "text-light-200"}`;

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {spooky && (
        <>
          <button
            data-spooky-toggle="music"
            onClick={toggleMusic}
            aria-pressed={music}
            aria-label="Spooky music"
            title={musicMissing ? "No music file found yet" : music ? "Music on" : "Music off"}
            className={toggleClass(music)}
          >
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 18V5l11-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="17" cy="16" r="3" />
              {!music && <Slash />}
            </svg>
          </button>

          {scaresEnabled && (
          <button
            data-spooky-toggle="scares"
            onClick={toggleScares}
            aria-pressed={scares}
            aria-label="Random jumpscares"
            title={scares ? "Jumpscares on... watch out" : "Jumpscares off"}
            className={toggleClass(scares)}
          >
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinejoin="round" d="M5 21V10a7 7 0 0 1 14 0v11l-2.5-2-2.3 2-2.2-2-2.2 2-2.3-2Z" />
              <circle cx="9.5" cy="10.5" r="1" fill="currentColor" />
              <circle cx="14.5" cy="10.5" r="1" fill="currentColor" />
              {!scares && <Slash />}
            </svg>
          </button>
          )}
        </>
      )}

      <button
        data-spooky-toggle="theme"
        onClick={toggleSpooky}
        aria-pressed={spooky}
        aria-label="Spooky Halloween theme"
        title={spooky ? "Turn off spooky mode" : "Turn on spooky mode"}
        className={`btn-icon w-10 h-10 ${spooky ? "border-brand/60 bg-brand/15 shadow-[0_0_24px_-4px_rgb(var(--brand-rgb)/0.8)]" : ""}`}
      >
        <Pumpkin lit={spooky} />
      </button>
    </div>
  );
};

export default SpookyControls;
