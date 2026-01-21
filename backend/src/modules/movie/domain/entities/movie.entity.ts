import { BaseEntity } from '@/shared/domain';

export interface MovieProps {
    externalId?: string;
    title: string;
    mediaType: 'movie' | 'tv';
    description?: string;
    posterUrl?: string;
    backdropUrl?: string;
    trailerUrl?: string;
    releaseDate?: Date;
    duration?: number;
    rating?: number;
    genres: string[];
    provider: string;
    streamUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Movie Entity - Framework-agnostic domain entity
 */
export class Movie extends BaseEntity<string> {
    private props: MovieProps;

    private constructor(id: string, props: MovieProps) {
        super(id);
        this.props = props;
    }

    get externalId(): string | undefined {
        return this.props.externalId;
    }

    get title(): string {
        return this.props.title;
    }

    get mediaType(): 'movie' | 'tv' {
        return this.props.mediaType;
    }

    get description(): string | undefined {
        return this.props.description;
    }

    get posterUrl(): string | undefined {
        return this.props.posterUrl;
    }

    get backdropUrl(): string | undefined {
        return this.props.backdropUrl;
    }

    get releaseDate(): Date | undefined {
        return this.props.releaseDate;
    }

    get duration(): number | undefined {
        return this.props.duration;
    }

    get rating(): number | undefined {
        return this.props.rating;
    }

    get genres(): string[] {
        return this.props.genres;
    }

    get provider(): string {
        return this.props.provider;
    }

    get streamUrl(): string | undefined {
        return this.props.streamUrl;
    }

    get trailerUrl(): string | undefined {
        return this.props.trailerUrl;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }

    public static create(id: string, props: MovieProps): Movie {
        return new Movie(id, props);
    }
}
