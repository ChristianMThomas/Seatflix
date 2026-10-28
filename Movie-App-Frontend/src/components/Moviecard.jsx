import React from 'react';
import { useNavigate } from 'react-router-dom';
import { img, mediaTypeOf, titleOf, yearOf } from '../tmdb';

// Pointer position drives a subtle 3D tilt and a moving glare highlight
const handleTilt = (e) => {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width;
  const y = (e.clientY - rect.top) / rect.height;
  el.style.setProperty('--ry', `${(x - 0.5) * 14}deg`);
  el.style.setProperty('--rx', `${(0.5 - y) * 14}deg`);
  el.style.setProperty('--mx', `${x * 100}%`);
  el.style.setProperty('--my', `${y * 100}%`);
};

const resetTilt = (e) => {
  e.currentTarget.style.setProperty('--rx', '0deg');
  e.currentTarget.style.setProperty('--ry', '0deg');
};

const Moviecard = ({ movie, className = '' }) => {
  const navigate = useNavigate();

  const mediaType = mediaTypeOf(movie);
  const title = titleOf(movie);
  const year = yearOf(movie);
  const { vote_average, poster_path, id } = movie;

  const handleClick = () => {
    if (!id) {
      console.error('Media ID is undefined!');
      return;
    }
    // Navigate with media type: /Watch/movie/123 or /Watch/tv/456
    navigate(`/Watch/${mediaType}/${id}`);
  };

  return (
    <li className={`list-none ${className}`}>
      <button
        type="button"
        className="movie-card group block w-full text-left cursor-pointer outline-none"
        onClick={handleClick}
        aria-label={`Open ${title}`}
      >
        <div className="poster-frame" onMouseMove={handleTilt} onMouseLeave={resetTilt}>
          <img
            src={img(poster_path) || '/No-Poster.png'}
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          <div className="absolute top-2 inset-x-2 flex items-start justify-between gap-2">
            {mediaType === 'tv' ? (
              <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-extrabold tracking-wider text-brand border border-brand/30">
                SERIES
              </span>
            ) : <span />}
            {vote_average > 0 && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold text-white border border-white/10">
                <svg className="w-3 h-3 text-brand" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />
                </svg>
                {vote_average.toFixed(1)}
              </span>
            )}
          </div>

          {/* Hover play affordance */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300">
            <span className="flex items-center justify-center w-14 h-14 rounded-full bg-brand text-white shadow-[0_0_40px_rgb(var(--brand-rgb)/0.7)] scale-75 group-hover:scale-100 transition-transform duration-300">
              <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </div>
        </div>

        <div className="mt-3 px-0.5">
          <h3 className="text-sm font-bold text-white leading-snug line-clamp-1 group-hover:text-brand transition-colors">
            {title}
          </h3>
          <p className="mt-0.5 text-xs text-gray-100 font-medium">
            {year || 'TBA'} · {mediaType === 'tv' ? 'Series' : 'Film'}
          </p>
        </div>
      </button>
    </li>
  );
};

export const MoviecardSkeleton = ({ className = '' }) => (
  <li className={`list-none ${className}`} aria-hidden="true">
    <div className="skeleton aspect-[2/3]" />
    <div className="skeleton h-3.5 w-3/4 mt-3 rounded-full" />
    <div className="skeleton h-3 w-1/3 mt-2 rounded-full" />
  </li>
);

export default Moviecard;
