const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${TMDB_API_KEY}`,
  },
};

export const tmdb = async (path, params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${TMDB_API_BASE_URL}${path}${query ? `?${query}` : ""}`, API_OPTIONS);
  if (!response.ok) {
    throw new Error(`TMDB request failed (${response.status}): ${path}`);
  }
  return response.json();
};

export const img = (path, size = "w500") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

// TV results use name/first_air_date where movies use title/release_date
export const mediaTypeOf = (item) =>
  item.media_type || (item.first_air_date || item.name ? "tv" : "movie");
export const titleOf = (item) => item.title || item.name;
export const yearOf = (item) => (item.release_date || item.first_air_date || "").slice(0, 4);

// Tag results from type-specific endpoints so cards know where to route
export const withType = (results = [], type) =>
  results.map((item) => ({ ...item, media_type: item.media_type || type }));

export const GENRES = {
  movie: [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 14, name: "Fantasy" },
    { id: 27, name: "Horror" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Sci-Fi" },
    { id: 53, name: "Thriller" },
  ],
  tv: [
    { id: 10759, name: "Action & Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 9648, name: "Mystery" },
    { id: 10764, name: "Reality" },
    { id: 10765, name: "Sci-Fi & Fantasy" },
  ],
};

const GENRE_NAMES = Object.fromEntries(
  [...GENRES.movie, ...GENRES.tv].map(({ id, name }) => [id, name])
);

export const genreNames = (ids = [], limit = 3) =>
  ids.map((id) => GENRE_NAMES[id]).filter(Boolean).slice(0, limit);
