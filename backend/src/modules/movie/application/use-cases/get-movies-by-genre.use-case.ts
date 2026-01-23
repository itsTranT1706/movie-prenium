import { Inject, Injectable } from '@nestjs/common';
import { Result } from '@/shared/domain';
import { Movie, MOVIE_REPOSITORY, MovieRepositoryPort } from '../../domain';
import { KKPhimMovieProvider } from '../../infrastructure/adapters';

@Injectable()
export class GetMoviesByGenreUseCase {
    constructor(
        private readonly kkphimProvider: KKPhimMovieProvider,
        @Inject(MOVIE_REPOSITORY)
        private readonly movieRepository: MovieRepositoryPort,
    ) { }

    async execute(genre: string, page = 1): Promise<Result<Movie[]>> {
        try {
            // Fetch movies by genre from KKPhim (supports Vietnamese genre slugs)
            const movies = await this.kkphimProvider.getMoviesByGenre(genre, page);

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
