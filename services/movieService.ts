import { Movie } from '@/types/movie';
import { fetchAllMovies, fetchMovieById, searchMovies, fetchMoviesByGenre } from '@/repositories/movieRepository';
import { getMovieRatings } from '@/repositories/ratingRepository';

export async function getMoviesWithRatings(): Promise<Movie[]> {
    try {
        console.log('MovieService: Fetching all movies with ratings...');

        const movies = await fetchAllMovies();

        const moviesWithRatings = await Promise.all(
            movies.map(async (movie) => {
                try {
                    const ratingData = await getMovieRatings(movie.id);
                    return {
                        ...movie,
                        averageRating: ratingData.averageRating || 0,
                        totalRatings: ratingData.totalRatings || 0,
                    };
                } catch (error) {
                    console.error(`Failed to get ratings for movie ID ${movie.id}:`, error);
                    return {
                        ...movie,
                        averageRating: 0,
                        totalRatings: 0,
                    };
                }
            })
        );
        
        return moviesWithRatings;
    } catch (error) {
        throw error;
    }
}

export async function getMovieWithRatings(id: number): Promise<Movie> {
    try {
        const movie = await fetchMovieById(id);
        const ratingData = await getMovieRatings(id);

        return{
            ...movie,
            averageRating: ratingData.averageRating || 0,
            totalRatings: ratingData.totalRatings || 0,
        };
    } catch (error) {
        throw error;
    }
}

export async function searchMoviesByName(query: string): Promise<Movie[]> {
  if (!query || query.trim().length === 0) {
    return [];
  }
  
  try {
    console.log('MovieService: Searching movies:', query);
    const movies = await searchMovies(query);
    return movies;
  } catch (error) {
    console.error('MovieService: Error searching movies:', error);
    throw error;
  }
}

export async function getMoviesByGenreWithRatings(genre: string): Promise<Movie[]> {
  try {
    console.log('MovieService: Fetching movies by genre with ratings:', genre);
    
    const movies = await fetchMoviesByGenre(genre);
    
    const moviesWithRatings = await Promise.all(
      movies.map(async (movie) => {
        try {
          const ratingData = await getMovieRatings(movie.id);
          return {
            ...movie,
            averageRating: ratingData.averageRating || 0,
            totalRatings: ratingData.totalRatings || 0,
          };
        } catch {
          return { ...movie, averageRating: 0, totalRatings: 0 };
        }
      })
    );
    
    return moviesWithRatings;
  } catch (error) {
    console.error('MovieService: Error fetching movies by genre:', error);
    throw error;
  }
}

export function sortMoviesByRating(movies: Movie[]): Movie[] {
  return [...movies].sort((a, b) => {
    const ratingA = a.averageRating || 0;
    const ratingB = b.averageRating || 0;
    return ratingB - ratingA;
  });
}

export function sortMoviesByYear(movies: Movie[]): Movie[] {
  return [...movies].sort((a, b) => b.releaseYear - a.releaseYear);
}

export function filterMoviesByMinRating(movies: Movie[], minRating: number): Movie[] {
  return movies.filter(movie => (movie.averageRating || 0) >= minRating);
}

export function formatMovieDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}