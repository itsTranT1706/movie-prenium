import { serverApi } from '@/lib/api/server';
import TheaterMoviesSection, { TheaterMovie } from './theater-movies-section';

/**
 * Server Component Wrapper for Theater Movies Section
 * Fetches data on server for better SEO and performance
 */
export default async function TheaterMoviesWrapper() {
    let movies: TheaterMovie[] = [];

    try {
        // Get popular movies (page 1)
        const popularMovies = await serverApi.getPopularMovies(1);

        // Take first 5 movies
        const topMovies = popularMovies.slice(0, 5);

        // Fetch details for each movie to get complete information including trailer
        const moviesWithDetails = await Promise.all(
            topMovies.map(async (movie) => {
                try {
                    // Use externalId (TMDB ID) instead of internal UUID
                    const tmdbId = movie.externalId || movie.id;
                    const details = await serverApi.getMovieDetails(tmdbId);
                    if (details) {
                        return {
                            id: details.externalId || details.id,
                            title: details.title,
                            subtitle: details.originalTitle !== details.title ? details.originalTitle : undefined,
                            backdropUrl: details.backdropUrl,
                            trailerUrl: details.trailerUrl,
                            posterUrl: details.posterUrl || '',
                            year: details.releaseDate ? new Date(details.releaseDate).getFullYear() : new Date().getFullYear(),
                            duration: details.duration ? `${Math.floor(details.duration / 60)}h ${details.duration % 60}m` : undefined,
                            rating: details.rating,
                            genres: details.genres,
                        };
                    }
                    // Fallback to basic movie data if details fetch fails
                    return {
                        id: movie.externalId || movie.id,
                        title: movie.title,
                        subtitle: movie.originalTitle !== movie.title ? movie.originalTitle : undefined,
                        backdropUrl: movie.backdropUrl,
                        trailerUrl: movie.trailerUrl,
                        posterUrl: movie.posterUrl || '',
                        year: movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : new Date().getFullYear(),
                        duration: movie.duration ? `${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m` : undefined,
                        rating: movie.rating,
                        genres: movie.genres,
                    };
                } catch (error) {
                    console.error(`Failed to fetch details for movie ${movie.externalId || movie.id}:`, error);
                    // Return basic movie data on error
                    return {
                        id: movie.externalId || movie.id,
                        title: movie.title,
                        subtitle: movie.originalTitle !== movie.title ? movie.originalTitle : undefined,
                        backdropUrl: movie.backdropUrl,
                        trailerUrl: movie.trailerUrl,
                        posterUrl: movie.posterUrl || '',
                        year: movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : new Date().getFullYear(),
                        duration: movie.duration ? `${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m` : undefined,
                        rating: movie.rating,
                        genres: movie.genres,
                    };
                }
            })
        );

        movies = moviesWithDetails;

        // Server-side logging
        // console.log('[Server] Theater movies loaded:', moviesWithDetails.map(m => ({
        //     title: m.title,
        //     hasTrailer: !!m.trailerUrl,
        //     hasBackdrop: !!m.backdropUrl,
        //     trailerUrl: m.trailerUrl,
        // })));
    } catch (error) {
        console.error('[Server] Failed to fetch theater movies:', error);
    }

    return <TheaterMoviesSection movies={movies} />;
}
