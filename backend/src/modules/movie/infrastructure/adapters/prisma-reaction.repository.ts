import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { ReactionRepositoryPort } from '../../domain/ports/reaction.repository.port';
import { MovieReaction, ReactionType, ReactionStats } from '../../domain/entities/reaction.entity';

@Injectable()
export class PrismaReactionRepository implements ReactionRepositoryPort {
    constructor(private readonly prisma: PrismaService) { }

    async saveReaction(userId: string, movieId: string, reaction: ReactionType, score: number, review?: string): Promise<MovieReaction> {
        const result = await this.prisma.movieReaction.upsert({
            where: {
                userId_movieId: {
                    userId,
                    movieId,
                },
            },
            update: {
                reaction,
                score,
                review: review || null,
            },
            create: {
                userId,
                movieId,
                reaction,
                score,
                review: review || null,
            },
        });

        return new MovieReaction(
            result.id,
            result.userId,
            result.movieId,
            result.reaction as ReactionType,
            result.score,
            result.createdAt,
            result.review,
        );
    }

    async getUserReaction(userId: string, movieId: string): Promise<MovieReaction | null> {
        const result = await this.prisma.movieReaction.findUnique({
            where: {
                userId_movieId: {
                    userId,
                    movieId,
                },
            },
        });

        if (!result) return null;

        return new MovieReaction(
            result.id,
            result.userId,
            result.movieId,
            result.reaction as ReactionType,
            result.score,
            result.createdAt,
        );
    }

    async getReactionStats(movieId: string): Promise<ReactionStats> {
        const reactions = await this.prisma.movieReaction.findMany({
            where: { movieId },
        });

        const totalVotes = reactions.length;
        if (totalVotes === 0) {
            return {
                totalVotes: 0,
                averageScore: 0,
                distribution: { positive: 0, mixed: 0 },
                counts: {
                    MASTERPIECE: 0,
                    LOVE: 0,
                    GOOD: 0,
                    MEH: 0,
                },
                reviews: [],
            };
        }

        const sumScore = reactions.reduce((sum, r) => sum + r.score, 0);
        const averageScore = Number((sumScore / totalVotes).toFixed(1));

        const counts = reactions.reduce((acc, r) => {
            const type = r.reaction as ReactionType;
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {} as Record<ReactionType, number>);

        const positiveCount = (counts[ReactionType.MASTERPIECE] || 0) +
            (counts[ReactionType.LOVE] || 0) +
            (counts[ReactionType.GOOD] || 0);
        const mixedCount = counts[ReactionType.MEH] || 0;

        // Calculate distribution percentages
        const positive = Math.round((positiveCount / totalVotes) * 100);
        const mixed = Math.round((mixedCount / totalVotes) * 100);

        // Fetch latest reviews
        const latestReviews = await this.prisma.movieReaction.findMany({
            where: {
                movieId,
                review: { not: null },
            },
            take: 20,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
            },
        });

        const reviews = latestReviews.map(r => ({
            id: r.id,
            userId: r.userId,
            userName: r.user.name || 'Anonymous',
            userAvatar: r.user.avatar || undefined,
            reaction: r.reaction as ReactionType,
            score: r.score,
            review: r.review || '',
            createdAt: r.createdAt,
        }));

        return {
            totalVotes,
            averageScore,
            distribution: {
                positive,
                mixed,
            },
            counts: {
                MASTERPIECE: counts[ReactionType.MASTERPIECE] || 0,
                LOVE: counts[ReactionType.LOVE] || 0,
                GOOD: counts[ReactionType.GOOD] || 0,
                MEH: counts[ReactionType.MEH] || 0,
            },
            reviews,
        };
    }
}
