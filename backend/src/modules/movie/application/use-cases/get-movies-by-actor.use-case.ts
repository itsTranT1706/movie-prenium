import { Injectable, Inject } from '@nestjs/common';
import { Result } from '@/shared/domain';
import { Movie, MOVIE_PROVIDER, MovieProviderPort } from '../../domain';

@Injectable()
export class GetMoviesByActorUseCase {
    constructor(
        @Inject(MOVIE_PROVIDER) private readonly movieProvider: MovieProviderPort,
    ) { }

    async execute(actorId: string): Promise<Result<Movie[]>> {
        try {
            if (!this.movieProvider.getMoviesByActor) {
                return Result.fail(new Error('Provider does not support fetching movies by actor'));
            }

            const movies = await this.movieProvider.getMoviesByActor(actorId);
            return Result.ok(movies);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }
}
