import { Injectable, Inject } from '@nestjs/common';
import { Result } from '@/shared/domain';
import { MOVIE_PROVIDER, MovieProviderPort } from '../../domain';
import { MovieCastDTO } from '../dtos/movie-cast.dto';

@Injectable()
export class GetMovieCastUseCase {
    constructor(
        @Inject(MOVIE_PROVIDER) private readonly movieProvider: MovieProviderPort,
    ) { }

    async execute(movieId: string): Promise<Result<MovieCastDTO[]>> {
        try {
            if (!this.movieProvider.getMovieCast) {
                return Result.fail(new Error('Provider does not support fetching cast'));
            }

            const cast = await this.movieProvider.getMovieCast(movieId);
            return Result.ok(cast);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }
}
