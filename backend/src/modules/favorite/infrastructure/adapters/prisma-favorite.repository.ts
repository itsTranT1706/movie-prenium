import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/prisma';
import { Favorite, FavoriteRepositoryPort } from '../../domain';

@Injectable()
export class PrismaFavoriteRepository implements FavoriteRepositoryPort {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string): Promise<Favorite | null> {
        const fav = await this.prisma.favorite.findUnique({ where: { id } });
        if (!fav) return null;
        return this.toDomain(fav);
    }

    async findAll(): Promise<Favorite[]> {
        const favs = await this.prisma.favorite.findMany();
        return favs.map(this.toDomain);
    }

    async findByUserId(userId: string): Promise<Favorite[]> {
        const favs = await this.prisma.favorite.findMany({ where: { userId } });
        return favs.map(this.toDomain);
    }

    async findByUserAndMovie(userId: string, movieId: string): Promise<Favorite | null> {
        const fav = await this.prisma.favorite.findUnique({
            where: { userId_movieId: { userId, movieId } },
        });
        if (!fav) return null;
        return this.toDomain(fav);
    }

    async save(entity: Favorite): Promise<Favorite> {
        const fav = await this.prisma.favorite.upsert({
            where: { id: entity.id },
            update: { userId: entity.userId, movieId: entity.movieId },
            create: {
                id: entity.id,
                userId: entity.userId,
                movieId: entity.movieId,
            },
        });
        return this.toDomain(fav);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.favorite.delete({ where: { id } });
    }

    async deleteByUserAndMovie(userId: string, movieId: string): Promise<void> {
        await this.prisma.favorite.delete({
            where: { userId_movieId: { userId, movieId } },
        });
    }

    async exists(id: string): Promise<boolean> {
        const count = await this.prisma.favorite.count({ where: { id } });
        return count > 0;
    }

    private toDomain(raw: any): Favorite {
        return Favorite.create(raw.id, {
            userId: raw.userId,
            movieId: raw.movieId,
            createdAt: raw.createdAt,
        });
    }
}
