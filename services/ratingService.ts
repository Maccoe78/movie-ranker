import { Rating, RatingRequest, MovieRatingsResponse, UserProfileStats, RatingWithMovie } from '@/types/rating';
import { getFollowing } from '@/repositories/followRepository';
import { addOrUpdateRating as addOrUpdateRatingRepo, 
  getUserRatings, 
  getMovieRatings, 
  deleteRating as deleteRatingRepo 
} from '@/repositories/ratingRepository';

export async function addOrUpdateRating(data: RatingRequest): Promise<Rating> {
  // BUSINESS LOGICA: Validatie
  if (!data.rating || data.rating < 1 || data.rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }

  if (data.comment && data.comment.length > 1000) {
    throw new Error('Comment cannot exceed 1000 characters');
  }

  try {
    console.log('RatingService: Submitting rating...', data);
    const result = await addOrUpdateRatingRepo(data);
    console.log('RatingService: Rating submitted successfully');
    return result;
  } catch (error) {
    console.error('RatingService: Error submitting rating:', error);
    throw error;
  }
}

export async function getMovieRatingsWithStats(movieId: number): Promise<MovieRatingsResponse> {
  try {
    console.log('RatingService: Fetching ratings for movie:', movieId);
    const ratingsData = await getMovieRatings(movieId);
    return ratingsData;
  } catch (error) {
    console.error('RatingService: Error fetching movie ratings:', error);
    throw error;
  }
}

export async function getUserRatingHistory(userId: number): Promise<RatingWithMovie[]> {
  try {
    console.log('RatingService: Fetching ratings for user:', userId);
    const ratings = await getUserRatings(userId);
    
    // BUSINESS LOGICA: Sort by date (newest first)
    return ratings.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });
  } catch (error) {
    console.error('RatingService: Error fetching user ratings:', error);
    throw error;
  }
}

export async function removeRating(ratingId: number): Promise<void> {
  try {
    console.log('RatingService: Deleting rating:', ratingId);
    await deleteRatingRepo(ratingId);
    console.log('RatingService: Rating deleted successfully');
  } catch (error) {
    console.error('RatingService: Error deleting rating:', error);
    throw error;
  }
}

export function validateRatingValue(rating: number): boolean {
  return rating >= 1 && rating <= 5 && Number.isInteger(rating);
}

export function calculateUserAverageRating(ratings: RatingWithMovie[]): number {
  if (ratings.length === 0) return 0;
  
  const total = ratings.reduce((sum, rating) => sum + rating.rating, 0);
  return Math.round((total / ratings.length) * 10) / 10; // Round to 1 decimal
}

export function getHighestRatedMovies(ratings: RatingWithMovie[], limit: number = 3): RatingWithMovie[] {
  return [...ratings]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

export function getRecentReviews(ratings: RatingWithMovie[], limit: number = 5): RatingWithMovie[] {
  return ratings
    .filter(rating => rating.comment && rating.comment.trim().length > 0)
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    })
    .slice(0, limit);
}

export function formatRatingDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

export function parseDate(dateArray: number[] | string | null): string {
  if (!dateArray) return 'No Date';

  if (typeof dateArray === 'string') {
    return new Date(dateArray).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  return 'Invalid Date';
}

export async function getUserProfileStats(userId: number): Promise<UserProfileStats> {
  try {
    const [ratings, followingData] = await Promise.all([
      getUserRatings(userId),
      getFollowing(userId)
    ]);

    const recentReviews: RatingWithMovie[] = getRecentReviews(ratings, 3);
    const favoriteMovies: RatingWithMovie[] = getHighestRatedMovies(ratings, 3);
    const averageRating: number = calculateUserAverageRating(ratings);

    return {
      recentReviews,
      reviewsCount: recentReviews.length,
      averageRating,
      favoriteMovies,
      followingCount: followingData.following.length
    };
  } catch (error) {
    console.error('RatingService: Error fetching profile stats:', error);
    throw error;
  }
}