import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { tmdb, img } from "../tmdb";

const COLUMNS = 7;

// Tilted, endlessly drifting wall of trending posters
const PosterWall = () => {
  const [posters, setPosters] = useState([]);

  useEffect(() => {
    Promise.all([tmdb("/trending/movie/week"), tmdb("/trending/tv/week")])
      .then(([movies, shows]) =>
        setPosters(
          [...movies.results, ...shows.results]
            .filter((item) => item.poster_path)
            .map((item) => img(item.poster_path, "w342"))
        )
      )
      .catch(() => setPosters([]));
  }, []);

  if (posters.length === 0) {
    return <img src="/hero-bg.png" alt="" className="w-full h-full object-cover animate-ken-burns" />;
  }

  const columns = Array.from({ length: COLUMNS }, (_, c) =>
    Array.from({ length: 6 }, (_, r) => posters[(c * 6 + r) % posters.length])
  );

  return (
    <div className="absolute -inset-[20%] flex gap-4 -rotate-12 scale-110 animate-fade-in" aria-hidden="true">
      {columns.map((column, c) => (
        <div key={c} className="flex-1 min-w-[140px] overflow-hidden">
          {/* Doubled list makes the -50% translate loop seamlessly */}
          <div
            className={`flex flex-col gap-4 ${c % 2 ? "animate-drift-down" : "animate-drift-up"}`}
            style={{ animationDuration: `${50 + (c % 3) * 15}s` }}
          >
            {[...column, ...column].map((src, i) => (
              <img key={i} src={src} alt="" className="w-full aspect-[2/3] object-cover rounded-xl" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Cinematic full-bleed backdrop shared by the Login and Register pages
const AuthShell = ({ children, aside }) => {
  return (
    <div className="min-h-screen bg-primary relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 overflow-hidden">
        <PosterWall />
        <div className="absolute inset-0 bg-primary/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(7,7,11,0.9)_75%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-primary/80" />
        <div className="absolute -left-40 top-1/3 w-[500px] h-[500px] rounded-full bg-brand/15 blur-3xl" />
      </div>

      <header className="relative z-10 px-4 sm:px-8 lg:px-14 py-6">
        <Link to="/" aria-label="SeatFlix">
          <Logo className="text-4xl sm:text-5xl" />
        </Link>
      </header>

      <div className="relative z-10 flex-1 flex items-center justify-center px-4 pb-12">
        <div className={`w-full ${aside ? "max-w-6xl grid lg:grid-cols-[1fr_460px] gap-16 items-center" : "max-w-[460px]"}`}>
          {aside && <div className="hidden lg:block animate-fade-in">{aside}</div>}
          <div className="relative animate-slide-in-up">
            <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-brand/40 via-white/10 to-transparent" />
            <div className="relative rounded-3xl bg-primary/80 backdrop-blur-2xl px-6 py-10 sm:px-10 sm:py-12 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]">
              {children}
            </div>
          </div>
        </div>
      </div>

      <footer className="relative z-10 px-4 sm:px-8 lg:px-14 py-6 text-xs text-gray-100">
        © 2025 ITT (Infinite Tech Team) · SeatFlix BETA v1.0.0
      </footer>
    </div>
  );
};

export const ButtonSpinner = () => (
  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

export default AuthShell;
