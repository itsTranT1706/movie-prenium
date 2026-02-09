import { Injectable, Inject } from '@nestjs/common';
import { TOP_BANNER_REPOSITORY, TopBannerRepository, TopBanner } from '../domain';

export interface CreateTopBannerInput {
    externalId?: string;
    title: string;
    originalTitle?: string;
    mediaType?: 'MOVIE' | 'TV';
    description?: string;
    posterUrl?: string;
    backdropUrl?: string;
    logoUrl?: string;
    trailerUrl?: string;
    releaseDate?: string;
    duration?: number;
    rating?: number;
    genres?: string[];
    order?: number;
    isActive?: boolean;
}

@Injectable()
export class CreateTopBannerUseCase {
    constructor(
        @Inject(TOP_BANNER_REPOSITORY)
        private readonly topBannerRepository: TopBannerRepository,
    ) { }

    async execute(input: CreateTopBannerInput): Promise<{ isFailure: boolean; value?: TopBanner; error?: { message: string } }> {
        try {
            // Check if externalId already exists
            if (input.externalId) {
                const existing = await this.topBannerRepository.findByExternalId(input.externalId);
                if (existing) {
                    return { isFailure: true, error: { message: 'Banner with this externalId already exists' } };
                }
            }

            const banner = await this.topBannerRepository.create({
                externalId: input.externalId || null,
                title: input.title,
                originalTitle: input.originalTitle || null,
                mediaType: input.mediaType || 'MOVIE',
                description: input.description || null,
                posterUrl: input.posterUrl || null,
                backdropUrl: input.backdropUrl || null,
                logoUrl: input.logoUrl || null,
                trailerUrl: input.trailerUrl || null,
                releaseDate: input.releaseDate ? new Date(input.releaseDate) : null,
                duration: input.duration || null,
                rating: input.rating || null,
                genres: input.genres || [],
                order: input.order ?? 0,
                isActive: input.isActive ?? true,
            });

            return { isFailure: false, value: banner };
        } catch (error) {
            return { isFailure: true, error: { message: 'Failed to create top banner' } };
        }
    }
}
