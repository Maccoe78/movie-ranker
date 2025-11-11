export interface Movie {
  id: number;
  name: string;
  releaseYear: number;
  description: string;
  durationMinutes: number;
  genres: string[];
  posterUrl?: string;
}