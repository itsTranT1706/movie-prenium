import { Injectable, Inject } from '@nestjs/common';
import { TOP_BANNER_REPOSITORY, TopBannerRepository, TopBanner } from '../domain';

export interface UpdateTopBannerInput {
    id: string;
    externalId?: string;
    title?: string;
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
export class UpdateTopBannerUseCase {
    constructor(
        @Inject(TOP_BANNER_REPOSITORY)
        private readonly topBannerRepository: TopBannerRepository,
    ) { }

    async execute(input: UpdateTopBannerInput): Promise<{ isFailure: boolean; value?: TopBanner; error?: { message: string } }> {
        try {
            const existing = await this.topBannerRepository.findById(input.id);
            if (!existing) {
                return { isFailure: true, error: { message: 'Top banner not found' } };
            }

            const updateData: Partial<TopBanner> = {};

            if (input.externalId !== undefined) updateData.externalId = input.externalId;
            if (input.title !== undefined) updateData.title = input.title;
            if (input.originalTitle !== undefined) updateData.originalTitle = input.originalTitle;
            if (input.mediaType !== undefined) updateData.mediaType = input.mediaType;
            if (input.description !== undefined) updateData.description = input.description;
            if (input.posterUrl !== undefined) updateData.posterUrl = input.posterUrl;
            if (input.backdropUrl !== undefined) updateData.backdropUrl = input.backdropUrl;
            if (input.logoUrl !== undefined) updateData.logoUrl = input.logoUrl;
            if (input.trailerUrl !== undefined) updateData.trailerUrl = input.trailerUrl;
            if (input.releaseDate !== undefined) updateData.releaseDate = new Date(input.releaseDate);
            if (input.duration !== undefined) updateData.duration = input.duration;
            if (input.rating !== undefined) updateData.rating = input.rating;
            if (input.genres !== undefined) updateData.genres = input.genres;
            if (input.order !== undefined) updateData.order = input.order;
            if (input.isActive !== undefined) updateData.isActive = input.isActive;

            const banner = await this.topBannerRepository.update(input.id, updateData);

            return { isFailure: false, value: banner };
        } catch (error) {
            return { isFailure: true, error: { message: 'Failed to update top banner' } };
        }
    }
}
