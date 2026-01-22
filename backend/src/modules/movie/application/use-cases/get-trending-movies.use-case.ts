import { Inject, Injectable } from '@nestjs/common';
import { Result } from '@/shared/domain';
import { Movie, MOVIE_PROVIDER, MovieProviderPort, MOVIE_REPOSITORY, MovieRepositoryPort } from '../../domain';

@Injectable()
export class GetTrendingMoviesUseCase {
    constructor(
        @Inject(MOVIE_PROVIDER)
        private readonly movieProvider: MovieProviderPort,
        @Inject(MOVIE_REPOSITORY)
        private readonly movieRepository: MovieRepositoryPort,
    ) { }

    async execute(timeWindow: 'day' | 'week' = 'week'): Promise<Result<Movie[]>> {
        try {
            // Fetch trending movies from TMDB
            const movies = await this.movieProvider.getTrendingMovies(timeWindow);
            
            // Cache results in repository
            await Promise.all(
                movies.map(movie => this.movieRepository.save(movie))
            );

            return Result.ok(movies);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }
}
