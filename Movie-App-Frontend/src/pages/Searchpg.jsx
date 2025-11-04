import React, { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import Search from "../components/Search";
import Spinner from "../components/Spinner";
import Moviecard from "../components/Moviecard";
import { getTrendingMovies, updateSearchCount } from "../appwrite";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${TMDB_API_KEY}`,
  },
};

const Searchpg = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [mediaList, setMediaList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debounceSearchTerm, setDebounceSearchTerm] = useState('');
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [mediaType, setMediaType] = useState('movie'); // 'movie' or 'tv'

  useDebounce(() => setDebounceSearchTerm(searchTerm), 750, [searchTerm]);

  const fetchMedia = async (query = '') => {
    setIsLoading(true);
    setErrorMsg("");

    try {
      const endpoint = mediaType === 'movie' ? 'movie' : 'tv';
      const TMDB_endpoint = query
        ? `${TMDB_API_BASE_URL}/search/${endpoint}?query=${encodeURIComponent(query)}`
        : `${TMDB_API_BASE_URL}/discover/${endpoint}?sort_by=popularity.desc`;

      const TMDB_response = await fetch(TMDB_endpoint, API_OPTIONS);

      if (!TMDB_response.ok) {
        throw new Error("Failed to fetch TMDB DATA");
      }

      const TMDB_data = await TMDB_response.json();

      if (TMDB_data.Response === "False") {
        setErrorMsg(TMDB_data.Error || "Failed to fetch data");
        setMediaList([]);
        return;
      }

      // Add media_type to each result for the card component
      const resultsWithType = TMDB_data.results.map(item => ({
        ...item,
        media_type: mediaType
      }));

      setMediaList(resultsWithType);
      if (query && TMDB_data.results.length > 0) {
        await updateSearchCount(query, TMDB_data.results[0]);
      }

    } catch (error) {
      console.error(`Error fetching TMDB DATA: ${error}`);
      setErrorMsg("Failed to load content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMedia = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  };

  useEffect(() => {
    loadTrendingMedia();
  }, []);

  useEffect(() => {
    fetchMedia(debounceSearchTerm);
  }, [debounceSearchTerm, mediaType]);

  return (
    <main className="relative">
      <div className="pattern opacity-30" />

      <div className="wrapper">
        <header className="animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-8">
            Discover Content
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>

          {/* Media Type Tabs */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => setMediaType('movie')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                mediaType === 'movie'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                  : 'bg-white/10 text-light-200 hover:bg-white/20'
              }`}
            >
              Movies
            </button>
            <button
              onClick={() => setMediaType('tv')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                mediaType === 'tv'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                  : 'bg-white/10 text-light-200 hover:bg-white/20'
              }`}
            >
              TV Shows
            </button>
          </div>
        </header>

        {trendingMovies.length > 0 && mediaType === 'movie' && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2 className="text-4xl text-center m-5">
            {mediaType === 'movie' ? "Explore today's hottest movies" : "Explore popular TV shows"}
          </h2>

          {isLoading ? (
            <Spinner />
          ) : errorMsg ? (
            <div className="backdrop-blur-xl bg-red-500/10 border border-red-500/50 rounded-2xl p-6 text-center">
              <p className="text-red-400 text-lg">{errorMsg}</p>
            </div>
          ) : (
            <ul>
              {mediaList.map((media) => (
                <Moviecard key={media.id} movie={media} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default Searchpg;
