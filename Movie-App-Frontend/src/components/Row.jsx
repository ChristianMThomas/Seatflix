import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Moviecard, { MoviecardSkeleton } from "./Moviecard";
import { img, mediaTypeOf, titleOf } from "../tmdb";

const Arrow = ({ dir, onClick }) => (
  <button onClick={onClick} className="btn-icon w-9 h-9" aria-label={dir < 0 ? "Scroll left" : "Scroll right"}>
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d={dir < 0 ? "m15 19-7-7 7-7" : "m9 5 7 7-7 7"} />
    </svg>
  </button>
);

// Horizontal carousel. `ranked` renders a top-10 style row with outlined numerals.
const Row = ({ title, eyebrow, items = [], loading = false, ranked = false }) => {
  const scroller = useRef(null);
  const navigate = useNavigate();

  const scroll = (dir) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  if (!loading && items.length === 0) return null;

  return (
    <section className="relative group/row">
      <div className="max-w-[1600px] mx-auto flex items-end justify-between gap-4 px-4 sm:px-8 lg:px-14">
        <div>
          {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
          <h2 className="row-title">{title}</h2>
        </div>
        <div className="hidden sm:flex gap-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
          <Arrow dir={-1} onClick={() => scroll(-1)} />
          <Arrow dir={1} onClick={() => scroll(1)} />
        </div>
      </div>

      <div className="relative max-w-[1600px] mx-auto">
        <ul ref={scroller} className="row-scroller">
          {loading
            ? Array.from({ length: 8 }, (_, i) => (
                <MoviecardSkeleton key={i} className="shrink-0 w-[140px] sm:w-[180px]" />
              ))
            : ranked
            ? items.slice(0, 10).map((item, i) => (
                <li key={item.id} className="shrink-0 snap-start list-none">
                  <button
                    onClick={() => navigate(`/Watch/${mediaTypeOf(item)}/${item.id}`)}
                    className="movie-card group flex items-end cursor-pointer outline-none"
                    aria-label={`Number ${i + 1}: ${titleOf(item)}`}
                  >
                    <span className="rank-numeral -mr-4 sm:-mr-6 relative z-0">{i + 1}</span>
                    <span className="poster-frame block relative z-10 w-[120px] sm:w-[150px]">
                      <img
                        src={img(item.poster_path, "w342") || "/No-Poster.png"}
                        alt=""
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </span>
                  </button>
                </li>
              ))
            : items.map((item) => (
                <Moviecard key={item.id} movie={item} className="shrink-0 snap-start w-[140px] sm:w-[180px]" />
              ))}
        </ul>
        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-6 sm:w-14 bg-gradient-to-r from-primary to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-6 sm:w-14 bg-gradient-to-l from-primary to-transparent" />
      </div>
    </section>
  );
};

export default Row;
