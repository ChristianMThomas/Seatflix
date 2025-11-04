import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${TMDB_API_KEY}`,
  },
};

const Watchpg = () => {
  const { type, id } = useParams(); // Extract media type (movie/tv) and ID
  const [loading, setLoading] = useState(true);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [tvDetails, setTvDetails] = useState(null);
  const [seasonData, setSeasonData] = useState(null);

  // Fetch TV show details to get number of seasons
  useEffect(() => {
    if (type === 'tv') {
      fetch(`${TMDB_API_BASE_URL}/tv/${id}`, API_OPTIONS)
        .then(res => res.json())
        .then(data => {
          setTvDetails(data);
        })
        .catch(err => console.error('Error fetching TV details:', err));
    }
  }, [type, id]);

  // Fetch season details to get number of episodes
  useEffect(() => {
    if (type === 'tv' && season) {
      fetch(`${TMDB_API_BASE_URL}/tv/${id}/season/${season}`, API_OPTIONS)
        .then(res => res.json())
        .then(data => {
          setSeasonData(data);
        })
        .catch(err => console.error('Error fetching season details:', err));
    }
  }, [type, id, season]);

  // Build embed URL based on media type
  const getEmbedUrl = () => {
    if (type === 'movie') {
      return `https://vidsrc-embed.ru/embed/movie?tmdb=${id}`;
    } else {
      return `https://vidsrc-embed.ru/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`;
    }
  };

  if (!id || !type) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="backdrop-blur-xl bg-red-500/10 border border-red-500/50 rounded-2xl p-8 text-center max-w-md animate-shake">
          <p className="text-red-400 text-xl">Invalid media ID or type. Please try again.</p>
        </div>
      </div>
    );
  }

  const embedUrl = getEmbedUrl();

  return (
    <main className="relative min-h-screen">
      {/* Background Pattern */}
      <div className="pattern opacity-20" />

      <div className="wrapper py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-3">
              {type === 'movie' ? 'Watch Movie' : 'Watch TV Show'}
            </h1>

            {/* Info Banner */}
            <div className="backdrop-blur-xl bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 max-w-2xl mx-auto mb-4">
              <p className="text-yellow-300 text-sm md:text-base">
                <strong>Note:</strong> If the content doesn't load, try disabling your ad-blocker and refresh the page.
              </p>
            </div>

            {tvDetails && type === 'tv' && (
              <div className="text-light-200 mb-4">
                <h2 className="text-2xl font-semibold">{tvDetails.name}</h2>
                <p className="text-sm mt-1">Season {season}, Episode {episode}</p>
              </div>
            )}
          </div>

          {/* TV Show Controls */}
          {type === 'tv' && (
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 animate-slide-in-up">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Season Selector */}
                <div className="space-y-3">
                  <label className="text-light-200 font-semibold block">
                    Season
                  </label>
                  <select
                    value={season}
                    onChange={(e) => {
                      setSeason(Number(e.target.value));
                      setEpisode(1); // Reset to episode 1 when changing season
                    }}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    {tvDetails?.number_of_seasons ? (
                      Array.from({ length: tvDetails.number_of_seasons }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num} className="bg-dark-100">
                          Season {num}
                        </option>
                      ))
                    ) : (
                      <option value={1}>Loading seasons...</option>
                    )}
                  </select>
                </div>

                {/* Episode Selector */}
                <div className="space-y-3">
                  <label className="text-light-200 font-semibold block">
                    Episode
                  </label>
                  <select
                    value={episode}
                    onChange={(e) => setEpisode(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    {seasonData?.episodes ? (
                      Array.from({ length: seasonData.episodes.length }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num} className="bg-dark-100">
                          Episode {num}
                          {seasonData.episodes[num - 1]?.name && ` - ${seasonData.episodes[num - 1].name}`}
                        </option>
                      ))
                    ) : (
                      <option value={1}>Loading episodes...</option>
                    )}
                  </select>
                </div>
              </div>

              {/* Episode Navigation Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setEpisode(Math.max(1, episode - 1))}
                  disabled={episode === 1}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous Episode
                </button>
                <button
                  onClick={() => setEpisode(Math.min(seasonData?.episodes.length || episode, episode + 1))}
                  disabled={episode === seasonData?.episodes.length}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Episode →
                </button>
              </div>
            </div>
          )}

          {/* Video Player */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-slide-in-up delay-200">
            {loading && (
              <div className="flex items-center justify-center h-96">
                <div className="text-center space-y-4">
                  <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-light-200 text-lg">Loading player...</p>
                </div>
              </div>
            )}

            <iframe
              key={embedUrl} // Force re-render when URL changes
              src={embedUrl}
              title={type === 'movie' ? 'Movie Player' : 'TV Show Player'}
              className="w-full aspect-video"
              style={{ minHeight: '600px' }}
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              onLoad={() => setLoading(false)}
            />
          </div>

          {/* Help Section */}
          <div className="mt-6 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 animate-slide-in-up delay-400">
            <h3 className="text-xl font-semibold text-white mb-4">Having Issues?</h3>
            <div className="space-y-3 text-light-200">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>Disable any ad-blockers or privacy extensions and refresh the page</p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>Try a different browser (Chrome, Firefox, or Safari)</p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>Check your internet connection</p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>If problems persist, contact support with the movie/show ID: <span className="text-purple-400 font-mono">{id}</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Watchpg;
