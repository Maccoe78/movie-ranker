import { Movie } from '@/types/movie';
import { apiClient } from './api';

export const movieService = {
  async getMovies(): Promise<Movie[]> {
    try {
      console.log('MovieService: Fetching movies...');
      const movies = await apiClient.getMovies();
      console.log('MovieService: Successfully fetched movies:', movies);
      return movies;
    } catch (error) {
      console.error('MovieService: Error fetching movies:', error);
      throw error;
    }
  },

  async getMovieById(id: number): Promise<Movie> {
    try {
      console.log('MovieService: Fetching movie by ID:', id);
      const movie = await apiClient.getMovieById(id);
      console.log('MovieService: Successfully fetched movie:', movie);
      return movie;
    } catch (error) {
      console.error('MovieService: Error fetching movie by ID:', error);
      throw error;
    }
  },

  async searchMovies(query: string): Promise<Movie[]> {
    try {
      console.log('MovieService: Searching movies with query:', query);
      const movies = await apiClient.searchMovies(query);
      console.log('MovieService: Successfully searched movies:', movies);
      return movies;
    } catch (error) {
      console.error('MovieService: Error searching movies:', error);
      throw error;
    }
  },

  async getMoviesByYear(year: number): Promise<Movie[]> {
    try {
      console.log('MovieService: Fetching movies by year:', year);
      const movies = await apiClient.getMoviesByYear(year);
      console.log('MovieService: Successfully fetched movies by year:', movies);
      return movies;
    } catch (error) {
      console.error('MovieService: Error fetching movies by year:', error);
      throw error;
    }
  },

  async getMoviesByGenre(genre: string): Promise<Movie[]> {
    try {
      console.log('MovieService: Fetching movies by genre:', genre);
      const movies = await apiClient.getMoviesByGenre(genre);
      console.log('MovieService: Successfully fetched movies by genre:', movies);
      return movies;
    } catch (error) {
      console.error('MovieService: Error fetching movies by genre:', error);
      throw error;
    }
  }
};