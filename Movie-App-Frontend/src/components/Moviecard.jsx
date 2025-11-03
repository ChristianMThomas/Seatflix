import React from 'react';
import { useNavigate } from 'react-router-dom';

const Moviecard = ({ movie: { title, vote_average, poster_path, id, release_date, overview } }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!id) {
        console.error('Movie ID is undefined!');
        return;
      }
      navigate(`/Watch/${id}`);

  };

  return (
    <div className="movie-card"  onClick={handleClick} style={{ cursor: 'pointer' }}>
        <img
          src={
            poster_path
              ? `https://image.tmdb.org/t/p/w500/${poster_path}`
              : '/no-movie.png'
          }
          alt={title}
        />
      <div className="mt-4 text-center font-serif">
        <h3>{title}</h3>

        <div className="content">
            <div className="rating">
                <img src="star.svg" alt="Star Icon"/>
                <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
            </div>

            <span>.</span>
            <p className="*year text-gray-400">
                {release_date ? release_date.split('-')[0] : 'N/A'}
            </p>
            <p className='text-amber-300 text-center '>{overview}</p>

        <div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Moviecard;