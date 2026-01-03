export interface Rating {
  id: number;
  userId: number;
  movieId: number;
  rating: number;        
  comment?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface RatingWithUser extends Rating {
  userName: string;
}

export interface MovieRatingsResponse {
  ratings: RatingWithUser[];
  averageRating: number;
  totalRatings: number;
}

export interface RatingRequest {
  userId: number;
  movieId: number;
  rating: number;
  comment?: string;
}

export interface UserProfileStats {
  recentReviews: Rating[];
  reviewsCount: number;
  averageRating: number;
  favoriteMovies: Rating[];
  followingCount: number;
}