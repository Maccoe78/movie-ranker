import React, { useState } from 'react';
import Image from 'next/image';
import { Movie } from '@/types/movie';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/lib/auth';

interface MovieModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

const MovieModal: React.FC<MovieModalProps> = ({ movie, isOpen, onClose }) => {
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const { user } = useAuth();

  if (!isOpen || !movie) return null;

const handleSubmitRating = async () => {
  if (rating === 0) {
    alert('Please select a rating');
    return;
  }

  const userId = user?.id;

  if (!user) {
    alert('Please log in to rate movies');
    return;
  }

  try {
    await apiClient.addOrUpdateRating({
      userId: user.id,
      movieId: movie.id,
      rating,
      comment: comment || undefined,
    });

    alert('Rating submitted successfully!');
    setShowRatingForm(false);
    setRating(0);
    setComment('');
  } catch (error) {
    console.error('Error submitting rating:', error);
    alert('Failed to submit rating');
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">{movie.name || 'Unknown Title'}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Poster */}
            <div className="md:col-span-1">
              <div className="relative h-96 w-full bg-gray-700 rounded-lg overflow-hidden">
                {movie.posterUrl ? (
                  <Image
                    src={movie.posterUrl}
                    alt={movie.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <svg className="w-24 h-24 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-4 mb-4">
                <span className="bg-gray-700 px-3 py-1 rounded text-sm text-gray-300">
                  {movie.releaseYear || 'Unknown Year'}
                </span>
                <span className="bg-gray-700 px-3 py-1 rounded text-sm text-gray-300">
                  {movie.durationMinutes || 0} min
                </span>
              </div>

              {/* Genres */}
              {movie.genres && movie.genres.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre, index) => (
                      <span 
                        key={index}
                        className="bg-purple-600 px-3 py-1 rounded text-sm text-white"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}



              {/* Plot */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Plot</h3>
                <p className="text-gray-300 leading-relaxed">
                  {movie.description || 'No description available.'}
                </p>
              </div>

              {!showRatingForm ? (
                <button
                  onClick={() => setShowRatingForm(true)}
                  className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg text-white font-medium transition-colors"
                >
                  Rate & Review This Movie
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="text-3xl"
                        >
                          {(hoverRating || rating) >= star ? '⭐' : '☆'}
                        </button>
                    ))}
                  </div>

                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your review (optional)..."
                    maxLength={1000}
                    className="w-full bg-gray-700 text-white rounded-lg p-3 min-h-[100px]"
                    />

                    <div className="flex gap-3">
                      <button
                        onClick={handleSubmitRating}
                        className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg text-white"
                        >
                          Submit Rating
                        </button>
                        <button
                          onClick={() => { setShowRatingForm(false); setRating(0); setComment(''); }}
                          className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg text-white"
                        >
                          Cancel
                        </button>
                    </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;