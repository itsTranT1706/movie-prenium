import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/prisma';
import { TopBannerRepository, TopBanner } from '../../domain';

@Injectable()
export class PrismaTopBannerRepository implements TopBannerRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(): Promise<TopBanner[]> {
        const banners = await this.prisma.topBanner.findMany({
            orderBy: { order: 'asc' },
        });
        return banners.map(this.mapToEntity);
    }

    async findById(id: string): Promise<TopBanner | null> {
        const banner = await this.prisma.topBanner.findUnique({
            where: { id },
        });
        return banner ? this.mapToEntity(banner) : null;
    }

    async findByExternalId(externalId: string): Promise<TopBanner | null> {
        const banner = await this.prisma.topBanner.findUnique({
            where: { externalId },
        });
        return banner ? this.mapToEntity(banner) : null;
    }

    async create(data: Omit<TopBanner, 'id' | 'createdAt' | 'updatedAt'>): Promise<TopBanner> {
        const banner = await this.prisma.topBanner.create({
            data: {
                externalId: data.externalId,
                title: data.title,
                originalTitle: data.originalTitle,
                mediaType: data.mediaType,
                description: data.description,
                posterUrl: data.posterUrl,
                backdropUrl: data.backdropUrl,
                logoUrl: data.logoUrl,
                trailerUrl: data.trailerUrl,
                releaseDate: data.releaseDate,
                duration: data.duration,
                rating: data.rating,
                genres: data.genres,
                order: data.order,
                isActive: data.isActive,
            },
        });
        return this.mapToEntity(banner);
    }

    async update(id: string, data: Partial<TopBanner>): Promise<TopBanner> {
        const banner = await this.prisma.topBanner.update({
            where: { id },
            data: {
                externalId: data.externalId,
                title: data.title,
                originalTitle: data.originalTitle,
                mediaType: data.mediaType,
                description: data.description,
                posterUrl: data.posterUrl,
                backdropUrl: data.backdropUrl,
                logoUrl: data.logoUrl,
                trailerUrl: data.trailerUrl,
                releaseDate: data.releaseDate,
                duration: data.duration,
                rating: data.rating,
                genres: data.genres,
                order: data.order,
                isActive: data.isActive,
            },
        });
        return this.mapToEntity(banner);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.topBanner.delete({
            where: { id },
        });
    }

    private mapToEntity(banner: any): TopBanner {
        return {
            id: banner.id,
            externalId: banner.externalId,
            title: banner.title,
            originalTitle: banner.originalTitle,
            mediaType: banner.mediaType,
            description: banner.description,
            posterUrl: banner.posterUrl,
            backdropUrl: banner.backdropUrl,
            logoUrl: banner.logoUrl,
            trailerUrl: banner.trailerUrl,
            releaseDate: banner.releaseDate,
            duration: banner.duration,
            rating: banner.rating,
            genres: banner.genres,
            order: banner.order,
            isActive: banner.isActive,
            createdAt: banner.createdAt,
            updatedAt: banner.updatedAt,
        };
    }
}
