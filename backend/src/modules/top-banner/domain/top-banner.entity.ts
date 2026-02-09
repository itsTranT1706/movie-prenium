export type MediaType = 'MOVIE' | 'TV';

export interface TopBanner {
    id: string;
    externalId?: string | null;
    title: string;
    originalTitle?: string | null;
    mediaType: MediaType;
    description?: string | null;
    posterUrl?: string | null;
    backdropUrl?: string | null;
    logoUrl?: string | null;
    trailerUrl?: string | null;
    releaseDate?: Date | null;
    duration?: number | null;
    rating?: number | null;
    genres: string[];
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
