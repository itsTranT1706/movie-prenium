import { TopBanner } from './top-banner.entity';

export const TOP_BANNER_REPOSITORY = Symbol('TOP_BANNER_REPOSITORY');

export interface TopBannerRepository {
    findAll(): Promise<TopBanner[]>;
    findById(id: string): Promise<TopBanner | null>;
    findByExternalId(externalId: string): Promise<TopBanner | null>;
    create(banner: Omit<TopBanner, 'id' | 'createdAt' | 'updatedAt'>): Promise<TopBanner>;
    update(id: string, data: Partial<TopBanner>): Promise<TopBanner>;
    delete(id: string): Promise<void>;
}
