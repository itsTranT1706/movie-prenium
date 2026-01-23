import { Inject, Injectable } from '@nestjs/common';
import { Result } from '@/shared/domain';
import { Movie, MOVIE_PROVIDER, MovieProviderPort, MOVIE_REPOSITORY, MovieRepositoryPort } from '../../domain';

@Injectable()
export class GetTopRatedMoviesUseCase {
    constructor(
        @Inject(MOVIE_PROVIDER)
        private readonly movieProvider: MovieProviderPort,
        @Inject(MOVIE_REPOSITORY)
        private readonly movieRepository: MovieRepositoryPort,
    ) { }

    async execute(page = 1): Promise<Result<Movie[]>> {
        try {
            // Fetch top rated movies from injected MOVIE_PROVIDER (will be TMDB)
            const movies = await this.movieProvider.getTopRatedMovies(page);
            
            // Cache movies with smart merge strategy
            await Promise.all(
                movies.map(movie => this.movieRepository.save(movie))
            );

            // Return movies to controller
            return Result.ok(movies);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }
}
