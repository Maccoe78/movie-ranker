'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Navigation from '@/components/Navigation';

interface Movie {
  id: number;
  title: string;
  year: number;
  genres: string[];
  rating: number;
  poster?: string;
}

export default function MoviesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - later vervang je dit met API calls
  const movies: Movie[] = [
    {
      id: 1,
      title: 'The Dark Knight',
      year: 2008,
      genres: ['Action', 'Crime'],
      rating: 4.8,
      poster: '/api/placeholder/300/450'
    },
    {
      id: 2,
      title: 'Inception',
      year: 2010,
      genres: ['Action', 'Sci-Fi'],
      rating: 4.7,
      poster: '/api/placeholder/300/450'
    },
    {
      id: 3,
      title: 'Pulp Fiction',
      year: 1994,
      genres: ['Crime', 'Drama'],
      rating: 4.6,
      poster: '/api/placeholder/300/450'
    },
    {
      id: 4,
      title: 'The Matrix',
      year: 1999,
      genres: ['Action', 'Sci-Fi'],
      rating: 4.5,
      poster: '/api/placeholder/300/450'
    },
    // Voeg meer movies toe om scrolling te testen
    ...Array.from({ length: 20 }, (_, i) => ({
      id: i + 5,
      title: `Movie ${i + 5}`,
      year: 2020 + (i % 5),
      genres: ['Drama', 'Action'],
      rating: 3.5 + (i % 2),
      poster: '/api/placeholder/300/450'
    }))
  ];

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Sticky Navigation */}
      <Navigation currentPage="Browse Movies" />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Browse Movies</h1>
          
          {/* Search Bar */}
          <div className="max-w-md">
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
              <button className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <div className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-r-lg transition-colors">
                  Search
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMovies.map((movie) => (
            <div key={movie.id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200">
              {/* Movie Poster */}
              <div className="relative aspect-[2/3] bg-gray-700">
                <div className="absolute top-3 left-3 bg-black/70 text-white text-sm px-2 py-1 rounded">
                  {movie.year}
                </div>
                {/* Placeholder for movie poster */}
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-20 h-20 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* Movie Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2">{movie.title}</h3>
                
                {/* Genres */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {movie.genres.map((genre) => (
                    <span key={genre} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                      {genre}
                    </span>
                  ))}
                </div>

                {/* Rating */}
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(movie.rating) ? 'text-purple-500' : 'text-gray-600'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-400">{movie.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}