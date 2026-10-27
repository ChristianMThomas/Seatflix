import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { tmdb, img, mediaTypeOf, titleOf, yearOf, genreNames } from "../tmdb";

const SLIDE_MS = 8000;

// Auto-rotating full-bleed hero built from trending titles
const Billboard = ({ items = [] }) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [logos, setLogos] = useState({});

  useEffect(() => {
    if (items.length < 2 || paused) return;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % items.length), SLIDE_MS);
    return () => clearTimeout(timer);
  }, [index, items.length, paused]);

  // Lazily fetch the official title treatment for the active slide
  useEffect(() => {
    const item = items[index];
    if (!item || logos[item.id] !== undefined) return;
    tmdb(`/${mediaTypeOf(item)}/${item.id}/images`, { include_image_language: "en,null" })
      .then((data) => {
        const logo = data.logos?.find((l) => l.iso_639_1 === "en") || data.logos?.[0];
        setLogos((prev) => ({ ...prev, [item.id]: logo?.file_path || null }));
      })
      .catch(() => setLogos((prev) => ({ ...prev, [item.id]: null })));
  }, [index, items, logos]);

  if (items.length === 0) {
    return <section className="h-[88vh] sm:h-screen skeleton rounded-none" aria-label="Loading featured titles" />;
  }

  const active = items[index];
  const type = mediaTypeOf(active);
  const logo = logos[active.id];

  return (
    <section
      className="relative h-[88vh] sm:h-screen min-h-[560px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      {/* Backdrops crossfade */}
      {items.map((item, i) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-[1400ms] ease-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== index}
        >
          <img
            src={img(item.backdrop_path, "w1280")}
            alt=""
            className={`w-full h-full object-cover ${i === index ? "animate-ken-burns" : ""}`}
          />
        </div>
      ))}
      <div className="absolute inset-0 scrim-left" />
      <div className="absolute inset-0 scrim-bottom" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,transparent_30%,rgba(7,7,11,0.6)_100%)]" />

      {/* Copy */}
      <div className="relative z-10 h-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-14 flex flex-col justify-end pb-32 sm:pb-40">
        <div key={active.id} className="max-w-2xl">
          <p className="eyebrow mb-4 animate-fade-in">
            <span className="w-6 h-px bg-brand" />
            #{index + 1} Trending this week
          </p>

          {logo ? (
            <img
              src={img(logo, "w500")}
              alt={titleOf(active)}
              className="max-h-28 sm:max-h-40 max-w-[80%] sm:max-w-md object-contain object-left drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)] animate-slide-in-up"
            />
          ) : (
            <h1 className="text-6xl sm:text-8xl lg:text-9xl text-glow animate-slide-in-up">{titleOf(active)}</h1>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-2 animate-slide-in-up delay-200">
            {active.vote_average > 0 && (
              <span className="chip text-brand border-brand/30">
                ★ {active.vote_average.toFixed(1)}
              </span>
            )}
            {yearOf(active) && <span className="chip">{yearOf(active)}</span>}
            <span className="chip">{type === "tv" ? "Series" : "Film"}</span>
            {genreNames(active.genre_ids).map((g) => (
              <span key={g} className="hidden xs:inline-flex chip">{g}</span>
            ))}
          </div>

          <p className="mt-5 text-base sm:text-lg text-light-100/90 leading-relaxed line-clamp-3 text-glow animate-slide-in-up delay-200">
            {active.overview}
          </p>

          <div className="mt-8 flex flex-wrap gap-3 animate-slide-in-up delay-400">
            <Link to={`/Watch/${type}/${active.id}?play=1`} className="btn-primary text-base sm:text-lg px-8 py-3.5">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Play Now
            </Link>
            <Link to={`/Watch/${type}/${active.id}`} className="btn-secondary text-base sm:text-lg px-8 py-3.5">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" />
                <path strokeLinecap="round" d="M12 11v5M12 8h.01" />
              </svg>
              Details
            </Link>
          </div>
        </div>
      </div>

      {/* Slide selector */}
      <div className="absolute z-10 bottom-28 sm:bottom-16 right-4 sm:right-8 lg:right-14 flex gap-2 sm:gap-3">
        {items.map((item, i) => (
          <button
            key={item.id}
            onClick={() => setIndex(i)}
            aria-label={`Show ${titleOf(item)}`}
            aria-current={i === index}
            className={`relative overflow-hidden rounded-lg transition-all duration-500 cursor-pointer ring-1 ${
              i === index ? "w-10 sm:w-28 ring-brand/70" : "w-6 sm:w-16 ring-white/15 opacity-60 hover:opacity-100"
            } h-1.5 sm:h-16`}
          >
            <img src={img(item.backdrop_path, "w300")} alt="" className="hidden sm:block absolute inset-0 w-full h-full object-cover" />
            <span className="absolute inset-0 bg-white/20 sm:bg-black/30" />
            {i === index && (
              <span
                className="absolute bottom-0 left-0 h-full sm:h-1 w-full bg-brand origin-left animate-progress"
                style={{ "--slide-duration": `${SLIDE_MS}ms`, animationPlayState: paused ? "paused" : "running" }}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
};

export default Billboard;
