import BaseApiClient from '../base-client';
import { Movie, MovieWithSources, StreamSource } from '@/types';

class MovieService extends BaseApiClient {
  async searchMovies(query: string, page = 1) {
    return this.request<Movie[]>(`/movies/search?q=${encodeURIComponent(query)}&page=${page}`);
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

  async getMovieDetails(slug: string, preview?: boolean) {
    const query = preview ? '?preview=true' : '';
    return this.request<MovieWithSources>(`/movies/${slug}${query}`);
  }

  async filterMovies(filters: {
    search?: string;
    genres?: string[];
    countries?: string[];
    yearFrom?: number;
    yearTo?: number;
    qualities?: string[];
    languages?: string[];
    status?: string[];
    type?: string;
    page?: number;
    limit?: number;
  }) {
    const params = new URLSearchParams();

    if (filters.search) params.append('search', filters.search);
    if (filters.genres?.length) params.append('genres', filters.genres.join(','));
    if (filters.countries?.length) params.append('countries', filters.countries.join(','));
    if (filters.yearFrom) params.append('yearFrom', filters.yearFrom.toString());
    if (filters.yearTo) params.append('yearTo', filters.yearTo.toString());
    if (filters.qualities?.length) params.append('qualities', filters.qualities.join(','));
    if (filters.languages?.length) params.append('languages', filters.languages.join(','));
    if (filters.status?.length) params.append('status', filters.status.join(','));
    if (filters.type) params.append('type', filters.type);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    return this.request<Movie[]>(`/movies/filter?${params.toString()}`);
  }

  // Generic GET method for any endpoint
  async get<T = any>(endpoint: string) {
    return this.request<T>(endpoint);
  }
}

export default MovieService;
