import { Injectable, Inject } from '@nestjs/common';
import { REACTION_REPOSITORY, ReactionRepositoryPort } from '../../domain/ports/reaction.repository.port';



@Injectable()
export class GetReactionStatsUseCase {
    constructor(
        @Inject(REACTION_REPOSITORY)
        private readonly reactionRepository: ReactionRepositoryPort,
    ) { }

    async execute(movieId: string) {
        return this.reactionRepository.getReactionStats(movieId);
    }

    async getUserReaction(userId: string, movieId: string) {
        return this.reactionRepository.getUserReaction(userId, movieId);
    }
}
