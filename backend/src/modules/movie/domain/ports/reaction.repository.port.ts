import { MovieReaction, ReactionStats, ReactionType } from '../entities/reaction.entity';

export interface ReactionRepositoryPort {
    saveReaction(userId: string, movieId: string, reaction: ReactionType, score: number): Promise<MovieReaction>;
    getReactionStats(movieId: string): Promise<ReactionStats>;
    getUserReaction(userId: string, movieId: string): Promise<MovieReaction | null>;
}

export const REACTION_REPOSITORY = Symbol('REACTION_REPOSITORY');
