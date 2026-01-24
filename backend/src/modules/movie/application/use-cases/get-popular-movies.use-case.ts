import { Inject, Injectable, Logger } from '@nestjs/common';
import { Result } from '@/shared/domain';
import { Movie, MOVIE_PROVIDER, MovieProviderPort, MOVIE_REPOSITORY, MovieRepositoryPort } from '../../domain';

@Injectable()
export class GetPopularMoviesUseCase {
    private readonly logger = new Logger(GetPopularMoviesUseCase.name);

    constructor(
        @Inject(MOVIE_PROVIDER)
        private readonly movieProvider: MovieProviderPort,
        @Inject(MOVIE_REPOSITORY)
        private readonly movieRepository: MovieRepositoryPort,
    ) { }

    async execute(page = 1): Promise<Result<Movie[]>> {
        try {
            // Fetch movies from injected MOVIE_PROVIDER (will be TMDB)
            const movies = await this.movieProvider.getPopularMovies(page);
            
            // If API returns empty, try to get from cache
            if (!movies || movies.length === 0) {
                this.logger.warn(`No movies from provider, attempting to get from cache`);
                const cachedMovies = await this.movieRepository.findAll();
                
                if (cachedMovies && cachedMovies.length > 0) {
                    this.logger.log(`Returning ${cachedMovies.length} movies from cache`);
                    // Return cached movies sorted by rating
                    const sortedMovies = cachedMovies
                        .filter(m => m.rating && m.rating > 0)
                        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                        .slice(0, 20); // Return top 20
                    
                    return Result.ok(sortedMovies);
                }
                
                this.logger.error('No movies available from provider or cache');
                return Result.fail(new Error('Unable to fetch movies'));
            }
            
            // Cache movies with smart merge strategy
            // The repository will preserve existing trailerUrl if new data doesn't have it
            // This allows list API to cache basic info while detail API adds trailer later
            await Promise.all(
                movies.map(movie => this.movieRepository.save(movie))
            );

            // Return movies to controller
            return Result.ok(movies);
        } catch (error) {
            this.logger.error(`Error in GetPopularMoviesUseCase: ${error}`);
            
            // Try to return cached movies as fallback
            try {
                const cachedMovies = await this.movieRepository.findAll();
                if (cachedMovies && cachedMovies.length > 0) {
                    this.logger.log(`Returning cached movies as fallback`);
                    return Result.ok(cachedMovies.slice(0, 20));
                }
            } catch (cacheError) {
                this.logger.error(`Failed to get cached movies: ${cacheError}`);
            }
            
            return Result.fail(error as Error);
        }
    }
}
