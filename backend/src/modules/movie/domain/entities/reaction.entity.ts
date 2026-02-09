export enum ReactionType {
    MASTERPIECE = 'MASTERPIECE',
    LOVE = 'LOVE',
    GOOD = 'GOOD',
    MEH = 'MEH',
}

export class MovieReaction {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        public readonly movieId: string,
        public readonly reaction: ReactionType,
        public readonly score: number,
        public readonly createdAt: Date,
        public readonly review?: string | null,
    ) { }
}

export interface ReactionStats {
    totalVotes: number;
    averageScore: number;
    distribution: {
        positive: number; // MASTERPIECE + LOVE + GOOD
        mixed: number;    // MEH
    };
    counts: Record<ReactionType, number>;
    reviews: {
        id: string;
        userId: string;
        userName: string;
        userAvatar?: string;
        reaction: ReactionType;
        score: number;
        review: string;
        createdAt: Date;
    }[];
}
