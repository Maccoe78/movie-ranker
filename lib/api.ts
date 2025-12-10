const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface UpdateUserRequest {
  username?: string;
  password?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
  };
}

export interface Movie {
  id: number;
  name: string;
  releaseYear: number;
  description: string;
  durationMinutes: number;
  genres: string[];
  posterUrl?: string;
}

export interface UserRating {
  id: number;
  user: { id: number; username: string; password: string };
  movie: {
    id: number;
    name: string;
    releaseYear: number;
    description: string;
    durationMinutes: number;
    genres: string[];
    posterUrl: string;
  };
  rating: number;
  comment?: string;
  createdAt: number[];
  updatedAt: string;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<{ message: string; username: string; token?: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    console.log('Login response from backend:', response);

    const username = response.username;
    
    if (!username) {
      throw new Error('Login response does not contain username');
    }

  
    try {
      const userDetails = await this.request<{ id: number; username: string; password: string }>(`/api/auth/users/username/${username}`, {
        method: 'GET',
      });

      console.log('User details from backend:', userDetails);

      return {
        token: response.token || 'dummy-token', 
        user: {
          id: userDetails.id,
          username: userDetails.username,
        }
      };
    } catch (error) {
      console.error('Failed to get user details:', error);
      throw new Error('Failed to get complete user information after login');
    }
  }

  async updateUser(userId: number, data: UpdateUserRequest): Promise<{ message: string; username: string }> {
    if (!userId || userId === undefined || userId === null) {
      throw new Error('Invalid user ID. Please log in again.');
    }

    console.log('Making updateUser request to:', `/api/auth/users/${userId}`);
    
    return this.request<{ message: string; username: string }>(`/api/auth/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data), 
    });
  }

  // Movie methods
  async getMovies(): Promise<Movie[]> {
    console.log('Fetching all movies...');
    return this.request<Movie[]>('/api/movies');
  }

  async getMovieById(id: number): Promise<Movie> {
    console.log('Fetching movie by ID:', id);
    return this.request<Movie>(`/api/movies/${id}`);
  }

  async searchMovies(query: string): Promise<Movie[]> {
    console.log('Searching movies with query:', query);
    return this.request<Movie[]>(`/api/movies/search?name=${encodeURIComponent(query)}`);
  }

  async getMoviesByYear(year: number): Promise<Movie[]> {
    console.log('Fetching movies by year:', year);
    return this.request<Movie[]>(`/api/movies/year/${year}`);
  }

  async getMoviesByGenre(genre: string): Promise<Movie[]> {
    console.log('Fetching movies by genre:', genre);
    return this.request<Movie[]>(`/api/movies/genre/${encodeURIComponent(genre)}`);
  }

  // Rating methods
  async addOrUpdateRating(data: {userId: number; movieId: number; rating: number; comment?: string}): Promise<{ id: number; userId: number; movieId: number; rating: number; comment?: string }> {
    return this.request('/api/ratings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getUserRatings(userId: number): Promise<unknown[]> {
    return this.request(`/api/ratings/user/${userId}`);
  }

  async getMovieRatings(movieId: number): Promise<{ ratings: Array<{ id: number; userId: number; userName: string; movieId: number; rating: number; comment?: string; createdAt: string }>; averageRating: number; totalRatings: number }> {
    return this.request(`/api/ratings/movie/${movieId}`);
  }

  async getUserMovieRating(userId: number, movieId: number): Promise<{ id: number; userId: number; movieId: number; rating: number; comment?: string }> {
    return this.request(`/api/ratings/user/${userId}/movie/${movieId}`);
  }

  async deleteRating(ratingId: number): Promise<{ message: string }> {
    return this.request(`/api/ratings/${ratingId}`, {
      method: 'DELETE',
    });
  }

}

export const apiClient = new ApiClient();