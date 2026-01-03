import { Movie } from '@/types/movie';

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

export async function fetchAllMovies(): Promise<Movie[]> {
  console.log('Fetching all movies...');
  return request<Movie[]>('/api/movies');
}

export async function fetchMovieById(id: number): Promise<Movie> {
  console.log('Fetching movie by ID:', id);
  return request<Movie>(`/api/movies/${id}`);
}

export async function searchMovies(query: string): Promise<Movie[]> {
  console.log('Searching movies with query:', query);
  return request<Movie[]>(`/api/movies/search?name=${encodeURIComponent(query)}`);
}

export async function fetchMoviesByYear(year: number): Promise<Movie[]> {
  console.log('Fetching movies by year:', year);
  return request<Movie[]>(`/api/movies/year/${year}`);
}

export async function fetchMoviesByGenre(genre: string): Promise<Movie[]> {
  console.log('Fetching movies by genre:', genre);
  return request<Movie[]>(`/api/movies/genre/${encodeURIComponent(genre)}`);
}