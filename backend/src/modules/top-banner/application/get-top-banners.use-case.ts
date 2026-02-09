import { Injectable, Inject } from '@nestjs/common';
import { TOP_BANNER_REPOSITORY, TopBannerRepository, TopBanner } from '../domain';

export interface GetTopBannersInput {
    activeOnly?: boolean;
}

@Injectable()
export class GetTopBannersUseCase {
    constructor(
        @Inject(TOP_BANNER_REPOSITORY)
        private readonly topBannerRepository: TopBannerRepository,
    ) { }

    async execute(input: GetTopBannersInput = {}): Promise<{ isFailure: boolean; value?: TopBanner[]; error?: { message: string } }> {
        try {
            const banners = await this.topBannerRepository.findAll();

            let result = banners;
            if (input.activeOnly !== false) {
                result = banners.filter(b => b.isActive);
            }

            // Sort by order ascending
            result.sort((a, b) => a.order - b.order);

            return { isFailure: false, value: result };
        } catch (error) {
            return { isFailure: true, error: { message: 'Failed to fetch top banners' } };
        }
    }
}
