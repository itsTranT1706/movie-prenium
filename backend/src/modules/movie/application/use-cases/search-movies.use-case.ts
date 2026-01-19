import { Inject, Injectable } from '@nestjs/common';
import { Result } from '@/shared/domain';
import { Movie, MOVIE_PROVIDER, MovieProviderPort, MOVIE_REPOSITORY, MovieRepositoryPort } from '../../domain';

export interface SearchMoviesInput {
    query: string;
}

@Injectable()
export class SearchMoviesUseCase {
    constructor(
        @Inject(MOVIE_PROVIDER)
        private readonly movieProvider: MovieProviderPort,
        @Inject(MOVIE_REPOSITORY)
        private readonly movieRepository: MovieRepositoryPort,
    ) { }

    async execute(input: SearchMoviesInput): Promise<Result<Movie[]>> {
        try {
            // First, search in local database
            const localMovies = await this.movieRepository.search(input.query);

            // Then, search from external provider
            const externalMovies = await this.movieProvider.searchMovies(input.query);

            // Combine results (local first, then external)
            const combinedMovies = [...localMovies, ...externalMovies];

            return Result.ok(combinedMovies);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }
}
