import { Injectable, Inject } from '@nestjs/common';
import { MOVIE_REPOSITORY } from '../../domain/ports/movie.repository.port';
import { REACTION_REPOSITORY } from '../../domain/ports/reaction.repository.port';
import { ReactionType } from '../../domain/entities/reaction.entity';



@Injectable()
export class ReactToMovieUseCase {
    constructor(
        @Inject(REACTION_REPOSITORY)
        private readonly reactionRepository: any, // Using any temporarily as interface needs to be imported correctly if strict
    ) { }

    async execute(userId: string, movieId: string, reaction: ReactionType, score: number, review?: string) {
        return this.reactionRepository.saveReaction(userId, movieId, reaction, score, review);
    }
}
