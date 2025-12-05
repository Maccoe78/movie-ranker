'use client';

import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import MovieCard from '@/components/MovieCard';
import MovieModal from '@/components/MovieModal';
import { Movie } from '@/types/movie';
import { movieService } from '@/lib/movieService';
import { apiClient } from '@/lib/api';

export default function MoviesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const fetchedMovies = await movieService.getMovies();
        const movieswithRatings = await Promise.all(
          fetchedMovies.map(async (movie) => {
            try {
              const ratingData = await apiClient.getMovieRatings(movie.id);
              return {
                ...movie,
                averageRating: ratingData.averageRating || 0,
                totalRatings: ratingData.totalRatings || 0,

              };
            } catch {
              return { ...movie, averageRating: 0, totalRatings: 0};
            }
          })
        )
        setMovies(movieswithRatings);
      } catch (err) {
        setError('Failed to load movies');
        console.error('Error fetching movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  const filteredMovies = movies.filter(movie =>
    movie.name && movie.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navigation currentPage="Browse Movies" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-white text-xl">Loading movies...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navigation currentPage="Browse Movies" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-red-400 text-xl">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation currentPage="Browse Movies" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Browse Movies</h1>
          <p className="text-gray-400">Discover and rate your favorite movies</p>
          
          {/* Search Bar */}
          <div className="max-w-md mt-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={handleMovieClick}
            />
          ))}
        </div>

        {filteredMovies.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-400">No movies found</p>
          </div>
        )}
      </div>

      <MovieModal
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}