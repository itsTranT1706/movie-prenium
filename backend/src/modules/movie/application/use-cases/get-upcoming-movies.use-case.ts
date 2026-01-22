import { Injectable, Inject } from '@nestjs/common';
import { Result } from '@/shared/domain';
import { Movie, MOVIE_REPOSITORY, MovieRepositoryPort } from '../../domain';
import { TMDBMovieProvider } from '../../infrastructure/adapters';

/**
 * Get Upcoming Movies Use Case
 * 
 * Uses TMDB API directly for upcoming movies since KKPhim doesn't have this data.
 */
@Injectable()
export class GetUpcomingMoviesUseCase {
    constructor(
        private readonly tmdbProvider: TMDBMovieProvider,
        @Inject(MOVIE_REPOSITORY)
        private readonly movieRepository: MovieRepositoryPort,
    ) { }

    async execute(page = 1): Promise<Result<Movie[]>> {
        try {
            const movies = await this.tmdbProvider.getUpcomingMovies(page);
            
            // Cache movies with smart merge strategy
            await Promise.all(
                movies.map(movie => this.movieRepository.save(movie))
            );
            
            return Result.ok(movies);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }
}
