import { Inject, Injectable } from '@nestjs/common';
import { Result } from '@/shared/domain';
import { Movie, MOVIE_PROVIDER, MovieProviderPort } from '../../domain';

@Injectable()
export class GetPopularMoviesUseCase {
    constructor(
        @Inject(MOVIE_PROVIDER)
        private readonly movieProvider: MovieProviderPort,
    ) { }

    async execute(page = 1): Promise<Result<Movie[]>> {
        try {
            const movies = await this.movieProvider.getPopularMovies(page);
            return Result.ok(movies);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }
}
