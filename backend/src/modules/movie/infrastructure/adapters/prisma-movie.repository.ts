import { Injectable } from '@nestjs/common';
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
        const data = {
            externalId: entity.externalId,
            title: entity.title,
            description: entity.description,
            posterUrl: entity.posterUrl,
            backdropUrl: entity.backdropUrl,
            releaseDate: entity.releaseDate,
            duration: entity.duration,
            rating: entity.rating,
            genres: entity.genres,
            provider: entity.provider,
            streamUrl: entity.streamUrl,
        };

        const movie = await this.prisma.movie.upsert({
            where: { id: entity.id },
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
            description: raw.description,
            posterUrl: raw.posterUrl,
            backdropUrl: raw.backdropUrl,
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
