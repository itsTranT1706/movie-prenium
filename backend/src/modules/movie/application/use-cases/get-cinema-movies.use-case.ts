import { Injectable, Logger, Inject } from '@nestjs/common';
import { Movie, MOVIE_PROVIDER, MovieProviderPort, MOVIE_REPOSITORY, MovieRepositoryPort } from '../../domain';

/**
 * Get Cinema Movies Use Case
 * Fetches movies currently in theaters (phim chiếu rạp)
 */
@Injectable()
export class GetCinemaMoviesUseCase {
    private readonly logger = new Logger(GetCinemaMoviesUseCase.name);

    constructor(
        @Inject(MOVIE_PROVIDER)
        private readonly movieProvider: MovieProviderPort,
        @Inject(MOVIE_REPOSITORY)
        private readonly movieRepository: MovieRepositoryPort,
    ) { }

    async execute(page = 1, limit = 24): Promise<Movie[]> {
        this.logger.log(`Getting cinema movies - page: ${page}, limit: ${limit}`);

        try {
            // Check if provider has getCinemaMovies method
            if ('getCinemaMovies' in this.movieProvider && typeof this.movieProvider.getCinemaMovies === 'function') {
                const movies = await this.movieProvider.getCinemaMovies(page, limit);
                this.logger.log(`Found ${movies.length} cinema movies`);
                
                // Cache movies with smart merge strategy
                await Promise.all(
                    movies.map(movie => this.movieRepository.save(movie))
                );
                
                return movies;
            }

            this.logger.warn('Provider does not support getCinemaMovies');
            return [];
        } catch (error) {
            this.logger.error(`Failed to get cinema movies: ${error.message}`);
            return [];
        }
    }
}
