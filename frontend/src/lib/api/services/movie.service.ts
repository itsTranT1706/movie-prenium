import BaseApiClient from '../base-client';
import { Movie, MovieWithSources, StreamSource } from '@/types';

class MovieService extends BaseApiClient {
  async searchMovies(query: string) {
    return this.request<Movie[]>(`/movies/search?q=${encodeURIComponent(query)}`);
  }

  async getPopularMovies(page = 1) {
    return this.request<Movie[]>(`/movies/popular?page=${page}`);
  }

  async getCinemaMovies(page = 1, limit = 24) {
    return this.request<Movie[]>(`/movies/cinema?page=${page}&limit=${limit}`);
  }

  async getMovieStreams(
    tmdbId: string,
    mediaType: 'movie' | 'tv' = 'movie',
    originalName?: string
  ) {
    const params = new URLSearchParams({ mediaType });
    if (originalName) params.append('originalName', originalName);
    return this.request<StreamSource[]>(`/movies/${tmdbId}/streams?${params.toString()}`);
  }

  async getMoviesByGenre(genre: string, page = 1) {
    return this.request<Movie[]>(`/movies/genre/${genre}?page=${page}`);
  }

  async getMoviesByCountry(country: string, page = 1) {
    return this.request<Movie[]>(`/movies/country/${country}?page=${page}`);
  }

  async getTrendingMovies(timeWindow: 'day' | 'week' = 'week') {
    return this.request<Movie[]>(`/movies/trending?timeWindow=${timeWindow}`);
  }

  async getUpcomingMovies(page = 1) {
    return this.request<Movie[]>(`/movies/upcoming?page=${page}`);
  }

  async getMovieDetails(slug: string) {
    return this.request<MovieWithSources>(`/movies/${slug}`);
  }
}

export default MovieService;
