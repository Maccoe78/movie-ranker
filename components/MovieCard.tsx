import React from 'react';
import Image from 'next/image';
import { Movie } from '@/types/movie';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  // Get the first genre or 'Unknown Genre'
  const primaryGenre = movie.genres && movie.genres.length > 0 ? movie.genres[0] : 'Unknown Genre';
  
  return (
    <div 
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
      onClick={() => onClick(movie)}
    >
      <div className="relative h-64 w-full bg-gray-700">
        {movie.posterUrl ? (
          <Image
            src={movie.posterUrl}
            alt={movie.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-gray-900/80 rounded px-2 py-1">
          <span className="text-sm font-medium text-white">{movie.releaseYear || 'N/A'}</span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2 truncate">{movie.name || 'Unknown Title'}</h3>
        <div className="flex items-center justify-between text-sm text-gray-300">
          <span>{primaryGenre}</span>
          <div className="flex items-center text-gray-400">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{movie.durationMinutes || 0} min</span>
          </div>
        </div>
        {movie.genres && movie.genres.length > 1 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {movie.genres.slice(0, 3).map((genre, index) => (
              <span key={index} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                {genre}
              </span>
            ))}
            {movie.genres.length > 3 && (
              <span className="text-xs text-gray-400">+{movie.genres.length - 3} more</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;