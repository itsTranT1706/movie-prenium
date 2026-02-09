import { Injectable, Inject } from '@nestjs/common';
import { Result } from '@/shared/domain';
import { MOVIE_PROVIDER, MovieProviderPort } from '../../domain';
import { ActorProfileDTO } from '../dtos/actor-profile.dto';

@Injectable()
export class GetActorProfileUseCase {
    constructor(
        @Inject(MOVIE_PROVIDER) private readonly movieProvider: MovieProviderPort,
    ) { }

    async execute(actorId: string): Promise<Result<ActorProfileDTO>> {
        try {
            if (!this.movieProvider.getActorProfile) {
                return Result.fail(new Error('Provider does not support fetching actor profile'));
            }

            const profile = await this.movieProvider.getActorProfile(actorId);
            if (!profile) {
                return Result.fail(new Error('Actor not found'));
            }

            return Result.ok(profile);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }
}
