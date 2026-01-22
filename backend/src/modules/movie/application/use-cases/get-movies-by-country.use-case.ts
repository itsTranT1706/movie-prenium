import { Injectable, Inject } from '@nestjs/common';
import { Result } from '@/shared/domain';
import { Movie, MOVIE_REPOSITORY, MovieRepositoryPort } from '../../domain';
import { KKPhimMovieProvider } from '../../infrastructure/adapters';

@Injectable()
export class GetMoviesByCountryUseCase {
    constructor(
        private readonly kkphimProvider: KKPhimMovieProvider,
        @Inject(MOVIE_REPOSITORY)
        private readonly movieRepository: MovieRepositoryPort,
    ) { }

    async execute(country: string, page = 1): Promise<Result<Movie[]>> {
        try {
            const movies = await this.kkphimProvider.getMoviesByCountry(country, page);
            
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
