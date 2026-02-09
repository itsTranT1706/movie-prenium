// Import all services from features
import { AuthService, authService } from '@/features/auth';
import { MovieService, movieService, FavoriteService, favoriteService, WatchHistoryService, watchHistoryService } from '@/features/movies/api';
import { UserService, userService } from '@/features/profile/api';
import { CommentService, commentService } from '@/features/comments/api';
import { StreamingService, streamingService } from '@/features/watch/api';
import RecommendationService, { recommendationService } from './recommendation.service';

// Shared token management across all services
const setToken = (token: string | null) => {
    authService.setToken(token);
    movieService.setToken(token);
    favoriteService.setToken(token);
    recommendationService.setToken(token);
    streamingService.setToken(token);
    userService.setToken(token);
    watchHistoryService.setToken(token);
    commentService.setToken(token);
};

const getToken = () => authService.getToken();

// Export unified API client for backward compatibility
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
    removeFavorite: favoriteService.removeFavorite.bind(favoriteService),

    // Recommendations
    getRecommendations: recommendationService.getRecommendations.bind(recommendationService),

    // Streaming
    getStream: streamingService.getStream.bind(streamingService),

    // Users
    getUser: userService.getUser.bind(userService),
    updateProfile: userService.updateProfile.bind(userService),
    changePassword: userService.changePassword.bind(userService),

    // Watch History
    addWatchHistory: (movieId: string, episodeNumber?: number, movieData?: any, serverName?: string) =>
        watchHistoryService.addWatchHistory(movieId, episodeNumber, movieData, serverName),
    markCompleted: watchHistoryService.markCompleted.bind(watchHistoryService),
    getContinueWatching: watchHistoryService.getContinueWatching.bind(watchHistoryService),
    getWatchHistory: watchHistoryService.getHistory.bind(watchHistoryService),
    removeWatchHistory: watchHistoryService.removeWatchHistory.bind(watchHistoryService),

    // Comments
    createComment: commentService.createComment.bind(commentService),
    createReply: commentService.createReply.bind(commentService),
    getMovieComments: commentService.getMovieComments.bind(commentService),
    getCommentCount: commentService.getCommentCount.bind(commentService),
    updateComment: commentService.updateComment.bind(commentService),
    deleteComment: commentService.deleteComment.bind(commentService),
    voteComment: commentService.voteComment.bind(commentService),
};

export default apiClient;

// Re-export services
export {
    AuthService,
    MovieService,
    FavoriteService,
    RecommendationService,
    StreamingService,
    UserService,
    CommentService,
};
