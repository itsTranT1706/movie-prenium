import {
  AuthService,
  MovieService,
  FavoriteService,
  RecommendationService,
  StreamingService,
  UserService,
} from './services';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_PREFIX = '/api/v1';
const BASE_URL = API_BASE_URL + API_PREFIX;

// Initialize service instances
const authService = new AuthService(BASE_URL);
const movieService = new MovieService(BASE_URL);
const favoriteService = new FavoriteService(BASE_URL);
const recommendationService = new RecommendationService(BASE_URL);
const streamingService = new StreamingService(BASE_URL);
const userService = new UserService(BASE_URL);

// Shared token management across all services
const setToken = (token: string | null) => {
  authService.setToken(token);
  movieService.setToken(token);
  favoriteService.setToken(token);
  recommendationService.setToken(token);
  streamingService.setToken(token);
  userService.setToken(token);
};

const getToken = () => authService.getToken();

// Export unified API client
export const apiClient = {
  // Token management
  setToken,
  getToken,

  // Generic GET request
  get: movieService.get.bind(movieService),

  // Auth
  login: authService.login.bind(authService),
  register: authService.register.bind(authService),

  // Movies
  searchMovies: movieService.searchMovies.bind(movieService),
  getPopularMovies: movieService.getPopularMovies.bind(movieService),
  getCinemaMovies: movieService.getCinemaMovies.bind(movieService),
  getMovieStreams: movieService.getMovieStreams.bind(movieService),
  getMoviesByGenre: movieService.getMoviesByGenre.bind(movieService),
  getMoviesByCountry: movieService.getMoviesByCountry.bind(movieService),
  getTrendingMovies: movieService.getTrendingMovies.bind(movieService),
  getUpcomingMovies: movieService.getUpcomingMovies.bind(movieService),
  getMovieDetails: movieService.getMovieDetails.bind(movieService),
  filterMovies: movieService.filterMovies.bind(movieService),

  // Favorites
  getFavorites: favoriteService.getFavorites.bind(favoriteService),
  addFavorite: favoriteService.addFavorite.bind(favoriteService),

  // Recommendations
  getRecommendations: recommendationService.getRecommendations.bind(recommendationService),

  // Streaming
  getStream: streamingService.getStream.bind(streamingService),

  // Users
  getUser: userService.getUser.bind(userService),
};

export default apiClient;
