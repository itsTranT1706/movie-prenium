import { Inject, Injectable } from '@nestjs/common';
import { Result } from '@/shared/domain';
import { Movie, MOVIE_REPOSITORY, MovieRepositoryPort } from '../../domain';
import { KKPhimMovieProvider } from '../../infrastructure/adapters';

export interface SearchMoviesInput {
    query: string;
    page?: number;
}

@Injectable()
export class SearchMoviesUseCase {
    constructor(
        private readonly kkphimProvider: KKPhimMovieProvider,
        @Inject(MOVIE_REPOSITORY)
        private readonly movieRepository: MovieRepositoryPort,
    ) { }

    async execute(input: SearchMoviesInput): Promise<Result<Movie[]>> {
        try {
            // Fetch movies from KKPhim provider (better Vietnamese search)
            const movies = await this.kkphimProvider.searchMovies(input.query, input.page || 1);

            // Save each movie to repository for caching
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
