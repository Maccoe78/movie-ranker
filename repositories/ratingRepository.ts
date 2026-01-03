import { MovieRatingsResponse, Rating, RatingRequest } from '@/types/rating';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `API Error: ${response.status}`);
  }

  const text = await response.text();
  
  if (!text) {
    return {} as T;
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    return { message: text } as T;
  }
}

export async function addOrUpdateRating(data: RatingRequest): Promise<Rating> {
    return request('/api/ratings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  export async function getUserRatings(userId: number): Promise<Rating[]> {
    return request(`/api/ratings/user/${userId}`);
  }

  export async function getMovieRatings(movieId: number): Promise<MovieRatingsResponse> {
    return request(`/api/ratings/movie/${movieId}`);
  }

  export async function getUserMovieRating(userId: number, movieId: number): Promise<Rating> {
    return request(`/api/ratings/user/${userId}/movie/${movieId}`);
  }

  export async function deleteRating(ratingId: number): Promise<{ message: string }> {
    return request(`/api/ratings/${ratingId}`, {
      method: 'DELETE',
    });
  }