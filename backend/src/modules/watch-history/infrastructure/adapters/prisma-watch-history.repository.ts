import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import {
    WatchHistory,
    WatchHistoryRepository,
} from '../../domain';

@Injectable()
export class PrismaWatchHistoryRepository implements WatchHistoryRepository {
    constructor(private readonly prisma: PrismaService) {}

    async addOrUpdate(
        userId: string,
        movieId: string,
        episodeNumber?: number,
        movieData?: any,
    ): Promise<WatchHistory> {
        const episodeNum = episodeNumber !== undefined ? episodeNumber : null;
        
        console.log('💾 [Repository] Upserting watch history:', {
            userId,
            movieId,
            episodeNumber: episodeNum,
            hasMovieData: !!movieData,
        });
        
        try {
            // Check if movie exists
            let movieExists = await this.prisma.movie.findUnique({
                where: { id: movieId },
            });

            let actualMovieId = movieId; // Track the actual movie ID to use

            // If movie doesn't exist and we have movieData, create it
            if (!movieExists && movieData) {
                console.log('⚠️ [Repository] Movie not found, creating from movieData...', {
                    movieId,
                    externalId: movieData.externalId,
                    title: movieData.title,
                });
                try {
                    movieExists = await this.prisma.movie.create({
                        data: {
                            id: movieId,
                            externalId: movieData.externalId || movieId,
                            title: movieData.title || 'Unknown Movie',
                            originalTitle: movieData.originalTitle,
                            mediaType: movieData.mediaType?.toUpperCase() === 'TV' ? 'TV' : 'MOVIE',
                            description: movieData.description,
                            posterUrl: movieData.posterUrl,
                            backdropUrl: movieData.backdropUrl,
                            releaseDate: movieData.releaseDate ? new Date(movieData.releaseDate) : null,
                            rating: movieData.rating,
                            genres: movieData.genres || [],
                            provider: 'tmdb',
                        },
                    });
                    console.log('✅ [Repository] Movie created successfully:', movieExists.id);
                    actualMovieId = movieExists.id;
                } catch (createError: any) {
                    console.log('❌ [Repository] Create error:', {
                        code: createError.code,
                        message: createError.message,
                    });
                    
                    // If duplicate key, fetch the existing movie
                    if (createError.code === 'P2002') {
                        console.log('ℹ️ [Repository] Duplicate detected, fetching existing movie...');
                        
                        // Try by externalId first (most likely duplicate)
                        if (movieData.externalId) {
                            console.log('🔍 [Repository] Trying to fetch by externalId:', movieData.externalId);
                            movieExists = await this.prisma.movie.findUnique({
                                where: { externalId: movieData.externalId },
                            });
                            if (movieExists) {
                                console.log('✅ [Repository] Found by externalId, using movie id:', movieExists.id);
                                actualMovieId = movieExists.id; // Use the existing movie's ID
                            }
                        }
                        
                        // If still not found, try by id
                        if (!movieExists) {
                            console.log('🔍 [Repository] Trying to fetch by id:', movieId);
                            movieExists = await this.prisma.movie.findUnique({
                                where: { id: movieId },
                            });
                            if (movieExists) {
                                console.log('✅ [Repository] Found by id');
                                actualMovieId = movieExists.id;
                            }
                        }
                    } else {
                        throw createError;
                    }
                }
            }

            if (!movieExists) {
                console.error('❌ [Repository] Movie still not found after all attempts:', {
                    movieId,
                    hadMovieData: !!movieData,
                    externalId: movieData?.externalId,
                });
                throw new Error(`Movie ${movieId} not found and no movieData provided`);
            }
            
            console.log('✅ [Repository] Using movie id:', actualMovieId);

            const data = await this.prisma.watchHistory.upsert({
                where: {
                    userId_movieId_episodeNumber: {
                        userId,
                        movieId: actualMovieId, // Use the actual movie ID
                        episodeNumber: episodeNum as any,
                    },
                },
                update: {
                    lastWatchedAt: new Date(),
                    completed: false,
                },
                create: {
                    userId,
                    movieId: actualMovieId, // Use the actual movie ID
                    episodeNumber: episodeNum,
                    firstWatchedAt: new Date(),
                    lastWatchedAt: new Date(),
                    completed: false,
                },
                include: {
                    movie: true,
                },
            });

            console.log('✅ [Repository] Upserted successfully:', {
                id: data.id,
                movieId: data.movieId,
                episodeNumber: data.episodeNumber,
            });

            return this.toDomain(data);
        } catch (error) {
            console.error('❌ [Repository] Upsert failed:', error);
            throw error;
        }
    }

    async markAsCompleted(
        userId: string,
        movieId: string,
        episodeNumber?: number,
    ): Promise<WatchHistory> {
        const episodeNum = episodeNumber !== undefined ? episodeNumber : null;
        
        const data = await this.prisma.watchHistory.update({
            where: {
                userId_movieId_episodeNumber: {
                    userId,
                    movieId,
                    episodeNumber: episodeNum as any,
                },
            },
            data: {
                completed: true,
                lastWatchedAt: new Date(),
            },
            include: {
                movie: true,
            },
        });

        return this.toDomain(data);
    }

    async getContinueWatching(
        userId: string,
        limit = 20,
    ): Promise<any[]> {
        const data = await this.prisma.watchHistory.findMany({
            where: {
                userId,
                completed: false,
            },
            include: {
                movie: true,
            },
            orderBy: {
                lastWatchedAt: 'desc',
            },
            take: limit,
        });

        // Return raw data with movie included
        return data;
    }

    async getHistory(
        userId: string,
        limit = 20,
        offset = 0,
    ): Promise<any[]> {
        const data = await this.prisma.watchHistory.findMany({
            where: {
                userId,
            },
            include: {
                movie: true,
            },
            orderBy: {
                lastWatchedAt: 'desc',
            },
            take: limit,
            skip: offset,
        });

        // Return raw data with movie included
        return data;
    }

    async remove(
        userId: string,
        movieId: string,
        episodeNumber?: number,
    ): Promise<void> {
        const episodeNum = episodeNumber !== undefined ? episodeNumber : null;
        
        await this.prisma.watchHistory.delete({
            where: {
                userId_movieId_episodeNumber: {
                    userId,
                    movieId,
                    episodeNumber: episodeNum as any,
                },
            },
        });
    }

    private toDomain(data: any): WatchHistory {
        return WatchHistory.create(data.id, {
            userId: data.userId,
            movieId: data.movieId,
            episodeNumber: data.episodeNumber ?? undefined,
            firstWatchedAt: data.firstWatchedAt,
            lastWatchedAt: data.lastWatchedAt,
            completed: data.completed,
        });
    }
}
