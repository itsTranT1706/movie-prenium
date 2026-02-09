import { Injectable, Inject } from '@nestjs/common';
import { TOP_BANNER_REPOSITORY, TopBannerRepository } from '../domain';

export interface DeleteTopBannerInput {
    id: string;
}

@Injectable()
export class DeleteTopBannerUseCase {
    constructor(
        @Inject(TOP_BANNER_REPOSITORY)
        private readonly topBannerRepository: TopBannerRepository,
    ) { }

    async execute(input: DeleteTopBannerInput): Promise<{ isFailure: boolean; error?: { message: string } }> {
        try {
            const existing = await this.topBannerRepository.findById(input.id);
            if (!existing) {
                return { isFailure: true, error: { message: 'Top banner not found' } };
            }

            await this.topBannerRepository.delete(input.id);

            return { isFailure: false };
        } catch (error) {
            return { isFailure: true, error: { message: 'Failed to delete top banner' } };
        }
    }
}
