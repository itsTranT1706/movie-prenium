/**
 * Server-side API client for React Server Components
 * Fetches data on the server to reduce client-side API calls
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_PREFIX = '/api/v1';
const BASE_URL = API_BASE_URL + API_PREFIX;

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface Movie {
  id: string;
  externalId?: string;
  title: string;
  originalTitle?: string;
  mediaType?: 'movie' | 'tv';
  description?: string;
  posterUrl?: string;
  backdropUrl?: string;
  releaseDate?: string;
  duration?: number;
  rating?: number;
  genres?: string[];
  quality?: string;
  episodeCurrent?: string;
  trailerUrl?: string;
}

/**
 * Server-side fetch with error handling
 */
async function serverFetch<T>(endpoint: string): Promise<ApiResponse<T>> {
  try {
    const url = `${BASE_URL}${endpoint}`;
    // console.log(`[Server API] Fetching: ${url}`);

    const response = await fetch(url, {
      cache: 'no-store', // Always get fresh data
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`[Server API] HTTP ${response.status} for ${endpoint}`);
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const data = await response.json();
    // console.log(`[Server API] Success for ${endpoint}:`, data.success);
    return data;
  } catch (error) {
    console.error(`[Server API] Error for ${endpoint}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Server API Client
 */
export const serverApi = {
  /**
   * Get popular movies
   */
  async getPopularMovies(page: number = 1): Promise<Movie[]> {
    const result = await serverFetch<Movie[]>(`/movies/popular?page=${page}`);
    return result.data || [];
  },

  /**
   * Get cinema movies
   */
  async getCinemaMovies(page: number = 1, limit: number = 10): Promise<Movie[]> {
    const result = await serverFetch<Movie[]>(`/movies/cinema?page=${page}&limit=${limit}`);
    return result.data || [];
  },

  /**
   * Get trending movies
   */
  async getTrendingMovies(timeWindow: 'day' | 'week' = 'week'): Promise<Movie[]> {
    const result = await serverFetch<Movie[]>(`/movies/trending?timeWindow=${timeWindow}`);
    return result.data || [];
  },

  /**
   * Get upcoming movies
   */
  async getUpcomingMovies(page: number = 1): Promise<Movie[]> {
    const result = await serverFetch<Movie[]>(`/movies/upcoming?page=${page}`);
    return result.data || [];
  },

  /**
   * Get top rated movies
   */
  async getTopRatedMovies(page: number = 1): Promise<Movie[]> {
    const result = await serverFetch<Movie[]>(`/movies/top-rated?page=${page}`);
    return result.data || [];
  },

  /**
   * Get movies by genre
   */
  async getMoviesByGenre(genreSlug: string, page: number = 1): Promise<Movie[]> {
    const result = await serverFetch<Movie[]>(`/movies/genre/${genreSlug}?page=${page}`);
    return result.data || [];
  },

  /**
   * Get movies by country
   */
  async getMoviesByCountry(countrySlug: string, page: number = 1): Promise<Movie[]> {
    const result = await serverFetch<Movie[]>(`/movies/country/${countrySlug}?page=${page}`);
    return result.data || [];
  },

  /**
   * Get movies by type (phim-bo, phim-le, hoat-hinh, tv-shows)
   */
  async getMoviesByType(type: string, page: number = 1): Promise<Movie[]> {
    const result = await serverFetch<Movie[]>(`/movies/type/${type}?page=${page}`);
    return result.data || [];
  },

  /**
   * Get movie details
   */
  async getMovieDetails(movieId: string): Promise<Movie | null> {
    const result = await serverFetch<Movie>(`/movies/${movieId}`);
    return result.data || null;
  },

  /**
   * Search movies
   */
  async searchMovies(query: string): Promise<Movie[]> {
    const result = await serverFetch<Movie[]>(`/movies/search?q=${encodeURIComponent(query)}`);
    return result.data || [];
  },
};

export default serverApi;
