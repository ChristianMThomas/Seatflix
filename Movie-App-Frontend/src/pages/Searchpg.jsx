import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "react-use";
import Search from "../components/Search";
import Moviecard, { MoviecardSkeleton } from "../components/Moviecard";
import { getTrendingMovies, updateSearchCount } from "../appwrite";
import { tmdb, img, withType, GENRES } from "../tmdb";

const Searchpg = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [mediaList, setMediaList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debounceSearchTerm, setDebounceSearchTerm] = useState('');
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [mediaType, setMediaType] = useState('movie'); // 'movie' or 'tv'
  const [genre, setGenre] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  useDebounce(() => setDebounceSearchTerm(searchTerm), 750, [searchTerm]);

  const fetchMedia = async (query = '', pageNum = 1) => {
    pageNum === 1 ? setIsLoading(true) : setLoadingMore(true);
    setErrorMsg("");

    try {
      const endpoint = mediaType === 'movie' ? 'movie' : 'tv';
      const TMDB_data = query
        ? await tmdb(`/search/${endpoint}`, { query, page: pageNum })
        : await tmdb(`/discover/${endpoint}`, {
            sort_by: 'popularity.desc',
            page: pageNum,
            ...(genre && { with_genres: genre }),
          });

      // Add media_type to each result for the card component
      const resultsWithType = withType(TMDB_data.results, mediaType);

      // TMDB pages can overlap, so drop repeats when appending
      setMediaList((prev) => {
        if (pageNum === 1) return resultsWithType;
        const seen = new Set(prev.map((m) => m.id));
        return [...prev, ...resultsWithType.filter((m) => !seen.has(m.id))];
      });
      setTotalPages(TMDB_data.total_pages || 1);
      if (query && pageNum === 1 && TMDB_data.results.length > 0) {
        await updateSearchCount(query, TMDB_data.results[0]);
      }

    } catch (error) {
      console.error(`Error fetching TMDB DATA: ${error}`);
      setErrorMsg("Failed to load content. Please try again.");
    } finally {
      setIsLoading(false);
      setLoadingMore(false);
    }
  };

  const loadTrendingMedia = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies || []);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  };

  useEffect(() => {
    loadTrendingMedia();
  }, []);

  useEffect(() => {
    setPage(1);
    fetchMedia(debounceSearchTerm, 1);
  }, [debounceSearchTerm, mediaType, genre]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchMedia(debounceSearchTerm, next);
  };

  const switchType = (value) => {
    setGenre(null);
    setMediaType(value);
  };

  const ambient = mediaList.find((m) => m.backdrop_path);

  return (
    <main className="relative">
      {/* Ambient backdrop, tinted by the top result */}
      <div className="absolute inset-x-0 top-0 h-[620px] overflow-hidden pointer-events-none">
        {ambient && (
          <img
            key={ambient.id}
            src={img(ambient.backdrop_path, "w1280")}
            alt=""
            className="w-full h-full object-cover opacity-35 blur-sm scale-110 animate-fade-in"
          />
        )}
        <div className="absolute inset-0 scrim-bottom" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent" />
      </div>

      <div className="wrapper">
        <header className="pt-6 sm:pt-12 pb-4 animate-fade-in">
          <p className="eyebrow mb-4">
            <span className="w-6 h-px bg-brand" />
            Browse {mediaType === 'movie' ? 'Movies' : 'TV Shows'}
          </p>
          <h1 className="max-w-4xl">
            Find your next <em className="text-brand">obsession.</em>
          </h1>

          <div className="mt-8 flex flex-col lg:flex-row lg:items-center gap-4">
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>

            {/* Media Type Tabs */}
            <div className="relative inline-grid grid-cols-2 self-start p-1.5 rounded-full glass" role="tablist">
              <span
                className={`absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] rounded-full bg-white shadow-lg transition-transform duration-300 ${
                  mediaType === 'tv' ? 'translate-x-full' : ''
                }`}
              />
              {[
                { value: 'movie', label: 'Movies' },
                { value: 'tv', label: 'TV Shows' },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  role="tab"
                  aria-selected={mediaType === value}
                  onClick={() => switchType(value)}
                  className={`relative z-10 px-6 py-3 rounded-full text-sm font-bold transition-colors duration-300 cursor-pointer ${
                    mediaType === value ? 'text-black' : 'text-light-200 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Genre chips (discover mode only) */}
          {!debounceSearchTerm && (
            <div className="mt-6 -mx-4 px-4 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto hide-scrollbar">
              {[{ id: null, name: 'All' }, ...GENRES[mediaType]].map(({ id, name }) => (
                <button
                  key={name}
                  onClick={() => setGenre(id)}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 cursor-pointer ${
                    genre === id
                      ? 'bg-brand text-white border-brand shadow-[0_0_20px_rgb(var(--brand-rgb)/0.4)]'
                      : 'bg-white/5 text-light-200 border-white/10 hover:text-white hover:border-white/30'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </header>

        {trendingMovies.length > 0 && mediaType === 'movie' && !debounceSearchTerm && (
          <section className="mt-12">
            <p className="eyebrow mb-2">Community picks</p>
            <h2 className="row-title">Top Searches on SeatFlix</h2>
            <ul className="flex gap-2 sm:gap-4 overflow-x-auto hide-scrollbar pt-4 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id} className="shrink-0 list-none">
                  <button
                    onClick={() => movie.movie_id && navigate(`/Watch/movie/${movie.movie_id}`)}
                    className="movie-card group flex items-end cursor-pointer outline-none"
                    aria-label={`Number ${index + 1}: ${movie.searchTerm}`}
                  >
                    <span className="rank-numeral -mr-4 sm:-mr-6">{index + 1}</span>
                    <span className="poster-frame block relative z-10 w-[110px] sm:w-[130px]">
                      <img src={movie.poster_url} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-12">
          <div className="flex items-end justify-between gap-4 mb-6">
            <h2 className="row-title">
              {debounceSearchTerm
                ? <>Results for <em className="text-brand">“{debounceSearchTerm}”</em></>
                : mediaType === 'movie' ? "Today's Hottest Movies" : "Popular TV Shows"}
            </h2>
          </div>

          {isLoading ? (
            <ul className="poster-grid">
              {Array.from({ length: 12 }, (_, i) => <MoviecardSkeleton key={i} />)}
            </ul>
          ) : errorMsg ? (
            <div className="panel border-ember/40 bg-ember/10 p-8 text-center">
              <p className="text-white text-lg">{errorMsg}</p>
            </div>
          ) : mediaList.length === 0 ? (
            <div className="panel p-14 text-center">
              <p className="font-display text-4xl text-white">Nothing on this reel.</p>
              <p className="text-light-200 text-sm mt-2">Try a different title or switch between Movies and TV Shows.</p>
            </div>
          ) : (
            <>
              <ul className="poster-grid">
                {mediaList.map((media) => (
                  <Moviecard key={`${media.media_type}-${media.id}`} movie={media} />
                ))}
              </ul>
              {page < totalPages && (
                <div className="mt-12 flex justify-center">
                  <button onClick={loadMore} disabled={loadingMore} className="btn-secondary px-10">
                    {loadingMore ? 'Loading…' : 'Load more'}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
};

export default Searchpg;
