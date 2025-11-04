import React from 'react';
import { useNavigate } from 'react-router-dom';

const Moviecard = ({ movie }) => {
  const navigate = useNavigate();

  // TV shows use different field names than movies
  const mediaType = movie.media_type || (movie.first_air_date ? 'tv' : 'movie');
  const title = movie.title || movie.name;
  const releaseDate = movie.release_date || movie.first_air_date;
  const { vote_average, poster_path, id, overview } = movie;

  const handleClick = () => {
    if (!id) {
      console.error('Media ID is undefined!');
      return;
    }
    // Navigate with media type: /Watch/movie/123 or /Watch/tv/456
    navigate(`/Watch/${mediaType}/${id}`);
  };

  return (
    <div
      className="movie-card group"
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={
            poster_path
              ? `https://image.tmdb.org/t/p/w500/${poster_path}`
              : '/no-movie.png'
          }
          alt={title}
          className="transition-transform duration-300 group-hover:scale-110"
        />
        {/* Media type badge */}
        {mediaType === 'tv' && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
            TV SHOW
          </div>
        )}
      </div>

      <div className="mt-4 text-center font-serif">
        <h3 className="line-clamp-1">{title}</h3>

        <div className="content">
          <div className="rating">
            <img src="star.svg" alt="Star Icon"/>
            <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
          </div>

          <span>.</span>
          <p className="year text-gray-400">
            {releaseDate ? releaseDate.split('-')[0] : 'N/A'}
          </p>
        </div>

        {overview && (
          <p className='text-amber-300 text-center text-sm mt-2 line-clamp-2'>
            {overview}
          </p>
        )}
      </div>
    </div>
  );
};

export default Moviecard;
