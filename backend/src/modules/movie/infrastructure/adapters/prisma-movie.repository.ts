import { Injectable } from '@nestjs/common';
import { MediaType } from '@prisma/client';
import { PrismaService } from '@/shared/infrastructure/prisma';
import { Movie, MovieRepositoryPort } from '../../domain';

@Injectable()
export class PrismaMovieRepository implements MovieRepositoryPort {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string): Promise<Movie | null> {
        const movie = await this.prisma.movie.findUnique({ where: { id } });
        if (!movie) return null;
        return this.toDomain(movie);
    }

    async findByExternalId(externalId: string): Promise<Movie | null> {
        const movie = await this.prisma.movie.findUnique({ where: { externalId } });
        if (!movie) return null;
        return this.toDomain(movie);
    }

    async findByExternalIdWithCache(externalId: string): Promise<Movie | null> {
        const movie = await this.prisma.movie.findUnique({ where: { externalId } });

        if (!movie) return null;

        // Check if cache is stale (older than 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        if (movie.updatedAt < sevenDaysAgo) {
            // Cache is stale - return null so caller can refresh
            return null;
        }

        return this.toDomain(movie);
    }

    async findAll(): Promise<Movie[]> {
        const movies = await this.prisma.movie.findMany();
        return movies.map(this.toDomain);
    }

    async findByGenre(genre: string): Promise<Movie[]> {
        const movies = await this.prisma.movie.findMany({
            where: { genres: { has: genre } },
        });
        return movies.map(this.toDomain);
    }

    async search(query: string): Promise<Movie[]> {
        const movies = await this.prisma.movie.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                ],
            },
        });
        return movies.map(this.toDomain);
    }

    async save(entity: Movie): Promise<Movie> {
        // Validate externalId - must be a non-empty string that's not "undefined"
        const externalId = entity.externalId;
        if (!externalId || externalId === 'undefined' || externalId === 'null' || externalId.trim() === '') {
            console.warn(`[PrismaMovieRepository] Skipping save for movie with invalid externalId: "${externalId}", title: "${entity.title}"`);
            // Return the entity as-is without saving to avoid Prisma errors
            return entity;
        }

        // Check if movie already exists in cache
        const existing = await this.prisma.movie.findUnique({
            where: { externalId }
        });

        const data = {
            externalId,
            title: entity.title,
            originalTitle: entity.originalTitle,
            mediaType: entity.mediaType === 'movie' ? MediaType.MOVIE : MediaType.TV,
            description: entity.description,
            posterUrl: entity.posterUrl,
            backdropUrl: entity.backdropUrl,
            logoUrl: entity.logoUrl,
            backdrops: entity.backdrops || [],
            posters: entity.posters || [],
            // Smart merge: Only update trailerUrl if new value is not null
            // This prevents list API (without trailer) from overwriting detail API (with trailer)
            trailerUrl: entity.trailerUrl !== null ? entity.trailerUrl : (existing?.trailerUrl || null),
            releaseDate: entity.releaseDate,
            duration: entity.duration,
            rating: entity.rating,
            genres: entity.genres,
            provider: entity.provider,
            streamUrl: entity.streamUrl,
        };

        // Use externalId as the unique key for upsert to avoid duplicates
        const movie = await this.prisma.movie.upsert({
            where: { externalId },
            update: data,
            create: { id: entity.id, ...data },
        });

        return this.toDomain(movie);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.movie.delete({ where: { id } });
    }

    async exists(id: string): Promise<boolean> {
        const count = await this.prisma.movie.count({ where: { id } });
        return count > 0;
    }

    private toDomain(raw: any): Movie {
        return Movie.create(raw.id, {
            externalId: raw.externalId,
            title: raw.title,
            originalTitle: raw.originalTitle,
            mediaType: raw.mediaType === MediaType.TV ? 'tv' : 'movie',
            description: raw.description,
            posterUrl: raw.posterUrl,
            backdropUrl: raw.backdropUrl,
            logoUrl: raw.logoUrl || undefined,
            backdrops: raw.backdrops,
            posters: raw.posters,
            trailerUrl: raw.trailerUrl,
            releaseDate: raw.releaseDate,
            duration: raw.duration,
            rating: raw.rating,
            genres: raw.genres,
            provider: raw.provider,
            streamUrl: raw.streamUrl,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        });
    }
}
