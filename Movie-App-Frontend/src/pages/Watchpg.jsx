import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Row from '../components/Row';
import { tmdb, img, withType } from '../tmdb';

const EMBED_HOST = import.meta.env.VITE_EMBED_HOST;

const formatRuntime = (mins) => (mins ? `${Math.floor(mins / 60)}h ${mins % 60}m` : null);

const PlayIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const Watchpg = () => {
  const { type, id } = useParams(); // Extract media type (movie/tv) and ID
  const [searchParams] = useSearchParams();
  const autoplay = searchParams.get('play') === '1';

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [seasonData, setSeasonData] = useState(null);
  const [playing, setPlaying] = useState(autoplay);
  const [lightsOff, setLightsOff] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const playerRef = useRef(null);

  // Load details (with cast, trailers, logos, recommendations) and reset per-title state
  useEffect(() => {
    setDetails(null);
    setSeason(1);
    setEpisode(1);
    setSeasonData(null);
    setPlaying(autoplay);
    setLightsOff(false);
    setShowTrailer(false);
    window.scrollTo({ top: 0 });

    if (!type || !id) return;
    tmdb(`/${type}/${id}`, {
      append_to_response: 'credits,recommendations,videos,images',
      include_image_language: 'en,null',
    })
      .then(setDetails)
      .catch((err) => console.error('Error fetching details:', err));
  }, [type, id, autoplay]);

  // Fetch season details to get the episode list
  useEffect(() => {
    if (type === 'tv' && season) {
      tmdb(`/tv/${id}/season/${season}`)
        .then(setSeasonData)
        .catch((err) => console.error('Error fetching season details:', err));
    }
  }, [type, id, season]);

  // Build embed URL based on media type
  const getEmbedUrl = () => {
    if (type === 'movie') {
      return `https://${EMBED_HOST}/embed/movie/${id}`;
    } else {
      return `https://${EMBED_HOST}/embed/tv/${id}/${season}/${episode}`;
    }
  };
  const embedUrl = getEmbedUrl();

  useEffect(() => {
    setLoading(true);
  }, [embedUrl]);

  useEffect(() => {
    if (playing) {
      playerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [playing, embedUrl]);

  useEffect(() => {
    if (!lightsOff && !showTrailer) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setLightsOff(false);
        setShowTrailer(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightsOff, showTrailer]);

  if (!id || !type) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="panel border-ember/40 bg-ember/10 p-8 text-center max-w-md animate-shake">
          <p className="text-white text-xl">Invalid media ID or type. Please try again.</p>
        </div>
      </div>
    );
  }

  const title = details?.title || details?.name;
  const year = (details?.release_date || details?.first_air_date || '').slice(0, 4);
  const logo = details?.images?.logos?.find((l) => l.iso_639_1 === 'en') || details?.images?.logos?.[0];
  const trailer =
    details?.videos?.results?.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ||
    details?.videos?.results?.find((v) => v.site === 'YouTube');
  const cast = details?.credits?.cast?.slice(0, 14) || [];
  const recommendations = withType(details?.recommendations?.results, type);
  const seasons = details?.seasons?.filter((s) => s.season_number > 0) || [];
  const episodes = seasonData?.episodes || [];
  const currentEpisode = episodes[episode - 1];

  const playEpisode = (num) => {
    setEpisode(num);
    setPlaying(true);
  };

  return (
    <main className="relative min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[88vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          {details?.backdrop_path ? (
            <img
              src={img(details.backdrop_path, 'original')}
              alt=""
              className="w-full h-full object-cover animate-ken-burns animate-fade-in"
            />
          ) : (
            <div className="w-full h-full skeleton rounded-none" />
          )}
        </div>
        <div className="absolute inset-0 scrim-left" />
        <div className="absolute inset-0 scrim-bottom" />

        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-14 pt-32 pb-14 grid md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr] gap-10 items-end">
          <div className="hidden md:block animate-slide-in-up">
            {details?.poster_path ? (
              <img
                src={img(details.poster_path)}
                alt={title}
                className="w-full rounded-2xl ring-1 ring-white/15 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] animate-float"
              />
            ) : (
              <div className="skeleton aspect-[2/3]" />
            )}
          </div>

          <div className="max-w-3xl">
            <p className="eyebrow mb-4 animate-fade-in">
              <span className="w-6 h-px bg-brand" />
              {type === 'tv' ? 'Series' : 'Feature Film'}
            </p>

            {logo ? (
              <img
                src={img(logo.file_path, 'w500')}
                alt={title}
                className="max-h-28 sm:max-h-40 max-w-[85%] sm:max-w-lg object-contain object-left drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)] animate-slide-in-up"
              />
            ) : title ? (
              <h1 className="text-6xl sm:text-8xl text-glow animate-slide-in-up">{title}</h1>
            ) : (
              <div className="skeleton h-20 w-2/3" />
            )}

            {details?.tagline && (
              <p className="mt-4 font-display italic text-xl sm:text-2xl text-light-100/80 animate-slide-in-up delay-200">
                “{details.tagline}”
              </p>
            )}

            {details && (
              <div className="mt-5 flex flex-wrap items-center gap-2 animate-slide-in-up delay-200">
                {details.vote_average > 0 && (
                  <span className="chip text-brand border-brand/30">★ {details.vote_average.toFixed(1)}</span>
                )}
                {year && <span className="chip">{year}</span>}
                {type === 'movie'
                  ? formatRuntime(details.runtime) && <span className="chip">{formatRuntime(details.runtime)}</span>
                  : details.number_of_seasons && (
                      <span className="chip">
                        {details.number_of_seasons} Season{details.number_of_seasons > 1 ? 's' : ''}
                      </span>
                    )}
                {details.genres?.slice(0, 3).map((g) => (
                  <span key={g.id} className="chip">{g.name}</span>
                ))}
              </div>
            )}

            {details?.overview && (
              <p className="mt-5 text-base sm:text-lg text-light-100/90 leading-relaxed line-clamp-4 text-glow animate-slide-in-up delay-200">
                {details.overview}
              </p>
            )}

            {cast.length > 0 && (
              <p className="mt-3 text-sm text-light-200 animate-slide-in-up delay-400">
                <span className="text-gray-100">Starring </span>
                {cast.slice(0, 3).map((c) => c.name).join(', ')}
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-3 animate-slide-in-up delay-400">
              <button onClick={() => setPlaying(true)} className="btn-primary text-lg px-8 py-4">
                <PlayIcon className="w-6 h-6" />
                {type === 'tv' ? `Play S${season} · E${episode}` : 'Play'}
              </button>
              {trailer && (
                <button onClick={() => setShowTrailer(true)} className="btn-secondary text-lg px-8 py-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <rect x="2" y="5" width="20" height="14" rx="3" />
                    <path d="m10 9 5 3-5 3V9Z" fill="currentColor" />
                  </svg>
                  Trailer
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* No z-index here so the player can rise above the theater-mode dimmer */}
      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-14 space-y-16 pb-10">
        {/* Player / screen (sits above the film-grain layer) */}
        <section ref={playerRef} className={`relative scroll-mt-24 ${lightsOff ? 'z-[70]' : 'z-[46]'}`}>
          {/* Projector glow behind the screen */}
          {details?.backdrop_path && (
            <img
              src={img(details.backdrop_path, 'w780')}
              alt=""
              className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-40 scale-105 pointer-events-none"
            />
          )}

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <p className="eyebrow mb-1">{playing ? 'Now Playing' : 'Your Screen'}</p>
              <h2 className="font-display text-3xl sm:text-4xl font-normal">
                {title || (type === 'movie' ? 'Watch Movie' : 'Watch TV Show')}
                {type === 'tv' && (
                  <span className="text-light-200 text-xl sm:text-2xl"> · S{season} E{episode}
                    {currentEpisode?.name && <em className="text-white"> · {currentEpisode.name}</em>}
                  </span>
                )}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {playing && (
                <button
                  onClick={() => setLightsOff((v) => !v)}
                  className={`btn-secondary py-2.5 text-sm ${lightsOff ? 'bg-brand/20 border-brand/50 text-brand' : ''}`}
                  title="Dim everything except the player"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3Z" />
                  </svg>
                  {lightsOff ? 'Lights on' : 'Lights off'}
                </button>
              )}
            </div>
          </div>

          <div className="relative bg-black rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-[0_40px_120px_-30px_rgba(0,0,0,1)]">
            {playing ? (
              <>
                {loading && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
                    <div className="text-center space-y-4">
                      <div className="h-12 w-12 rounded-full border-2 border-white/10 border-t-brand animate-spin mx-auto"></div>
                      <p className="text-light-200">Loading player...</p>
                    </div>
                  </div>
                )}
                <iframe
                  key={embedUrl} // Force re-render when URL changes
                  src={embedUrl}
                  title={type === 'movie' ? 'Movie Player' : 'TV Show Player'}
                  className="w-full aspect-video block"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  onLoad={() => setLoading(false)}
                />
              </>
            ) : (
              <button
                onClick={() => setPlaying(true)}
                className="group relative block w-full aspect-video cursor-pointer"
                aria-label={`Play ${title || ''}`}
              >
                {details?.backdrop_path && (
                  <img
                    src={img(details.backdrop_path, 'w1280')}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover opacity-50 transition-all duration-700 group-hover:opacity-70 group-hover:scale-105"
                  />
                )}
                <span className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/40" />
                <span className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <span className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-brand text-white shadow-[0_0_60px_rgba(239,35,60,0.7)] transition-transform duration-300 group-hover:scale-110">
                    <span className="absolute inset-0 rounded-full bg-brand animate-ping opacity-30" />
                    <PlayIcon className="w-9 h-9 ml-1 relative" />
                  </span>
                  <span className="text-white font-bold tracking-wide">Start watching</span>
                </span>
              </button>
            )}
          </div>

          <p className="relative flex items-center gap-2 mt-3 text-xs text-light-200">
            <svg className="w-4 h-4 text-brand shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
            </svg>
            If the content doesn't load, try disabling your ad-blocker and refresh the page.
          </p>
        </section>

        {/* Episodes */}
        {type === 'tv' && (
          <section>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">
              <div>
                <p className="eyebrow mb-2">Episodes</p>
                <h2 className="row-title">Season {season}</h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => playEpisode(Math.max(1, episode - 1))}
                  disabled={episode === 1}
                  className="btn-secondary py-2.5 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m15 19-7-7 7-7" />
                  </svg>
                  Previous
                </button>
                <button
                  onClick={() => playEpisode(Math.min(episodes.length || episode, episode + 1))}
                  disabled={episode === episodes.length}
                  className="btn-primary py-2.5 text-sm"
                >
                  Next Episode
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Season pills */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-4" role="tablist" aria-label="Seasons">
              {(seasons.length ? seasons : [{ season_number: 1, name: 'Season 1' }]).map((s) => (
                <button
                  key={s.season_number}
                  role="tab"
                  aria-selected={season === s.season_number}
                  onClick={() => {
                    setSeason(s.season_number);
                    setEpisode(1); // Reset to episode 1 when changing season
                  }}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all cursor-pointer ${
                    season === s.season_number
                      ? 'bg-white text-black border-white'
                      : 'bg-white/5 text-light-200 border-white/10 hover:text-white hover:border-white/30'
                  }`}
                >
                  {s.name || `Season ${s.season_number}`}
                </button>
              ))}
            </div>

            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {episodes.length === 0
                ? Array.from({ length: 6 }, (_, i) => <li key={i} className="skeleton h-28 list-none" />)
                : episodes.map((ep) => {
                    const active = ep.episode_number === episode;
                    return (
                      <li key={ep.id} className="list-none">
                        <button
                          onClick={() => playEpisode(ep.episode_number)}
                          className={`group w-full flex gap-4 p-2.5 rounded-2xl text-left border transition-all duration-300 cursor-pointer ${
                            active
                              ? 'bg-brand/10 border-brand/50 shadow-[0_0_30px_-10px_rgba(239,35,60,0.5)]'
                              : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.07] hover:border-white/15'
                          }`}
                        >
                          <span className="relative shrink-0 w-36 sm:w-40 aspect-video rounded-xl overflow-hidden bg-surface-2">
                            {ep.still_path && (
                              <img src={img(ep.still_path, 'w300')} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            )}
                            <span className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                              <span className="w-9 h-9 rounded-full bg-brand text-white flex items-center justify-center">
                                <PlayIcon className="w-4 h-4 ml-0.5" />
                              </span>
                            </span>
                          </span>
                          <span className="min-w-0 py-1">
                            <span className={`block text-xs font-bold ${active ? 'text-brand' : 'text-gray-100'}`}>
                              E{ep.episode_number}{ep.runtime ? ` · ${ep.runtime}m` : ''}{active && playing ? ' · Playing' : ''}
                            </span>
                            <span className="block text-white font-bold leading-snug line-clamp-1">{ep.name}</span>
                            <span className="block text-light-200 text-xs leading-snug mt-1 line-clamp-2">{ep.overview}</span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
            </ul>
          </section>
        )}

        {/* Cast */}
        {cast.length > 0 && (
          <section>
            <p className="eyebrow mb-2">The ensemble</p>
            <h2 className="row-title mb-5">Cast</h2>
            <ul className="flex gap-4 sm:gap-6 overflow-x-auto hide-scrollbar pb-2">
              {cast.map((person) => (
                <li key={person.credit_id} className="shrink-0 w-24 sm:w-28 text-center list-none">
                  <span className="block w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-surface-2 ring-1 ring-white/10 mx-auto">
                    {person.profile_path ? (
                      <img src={img(person.profile_path, 'w185')} alt="" loading="lazy" className="w-full h-full object-cover" />
                    ) : (
                      <span className="w-full h-full flex items-center justify-center font-display text-4xl text-gray-100">
                        {person.name?.[0]}
                      </span>
                    )}
                  </span>
                  <span className="block mt-3 text-sm font-bold text-white leading-tight line-clamp-2">{person.name}</span>
                  <span className="block mt-0.5 text-xs text-gray-100 line-clamp-1">{person.character}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {recommendations.length > 0 && (
        <div className="relative z-10 py-6">
          <Row title="More Like This" eyebrow="Because you're here" items={recommendations} />
        </div>
      )}

      {/* Help Section */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-14 pb-28 sm:pb-20">
        <details className="panel group">
          <summary className="flex items-center justify-between cursor-pointer list-none p-5 text-white font-semibold">
            Having Issues?
            <svg className="w-5 h-5 text-light-200 transition-transform group-open:rotate-45" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M12 5v14M5 12h14" />
            </svg>
          </summary>
          <ul className="px-5 pb-5 space-y-3 text-light-200 text-sm">
            {[
              'Disable any ad-blockers or privacy extensions and refresh the page',
              'Try a different browser (Chrome, Firefox, or Safari)',
              'Check your internet connection',
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-3">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
                {tip}
              </li>
            ))}
            <li className="flex items-start gap-3">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
              <span>If problems persist, contact support with the movie/show ID: <span className="text-white font-mono">{id}</span></span>
            </li>
          </ul>
        </details>
      </div>

      {/* Theater mode: dims the whole page around the player */}
      <div
        onClick={() => setLightsOff(false)}
        className={`fixed inset-0 z-[60] bg-black/95 transition-opacity duration-700 ${
          lightsOff ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Trailer modal */}
      {showTrailer && trailer && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
          onClick={() => setShowTrailer(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`${title} trailer`}
        >
          <div className="relative w-full max-w-5xl animate-slide-in-up" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowTrailer(false)}
              className="btn-icon absolute -top-14 right-0"
              aria-label="Close trailer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
              title={`${title} trailer`}
              className="w-full aspect-video rounded-2xl ring-1 ring-white/10 shadow-2xl"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default Watchpg;
