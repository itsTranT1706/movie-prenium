import { BaseEntity } from '@/shared/domain';

export interface MovieProps {
    externalId?: string;
    slug?: string;
    title: string;
    originalTitle?: string;
    mediaType: 'movie' | 'tv';
    description?: string;
    posterUrl?: string;
    backdropUrl?: string;
    logoUrl?: string;
    backdrops?: string[];
    posters?: string[];
    trailerUrl?: string;
    releaseDate?: Date;
    duration?: number;
    rating?: number;
    genres: string[];
    cast?: string[];
    director?: string[];
    country?: string[];
    quality?: string;
    lang?: string;
    episodeCurrent?: string;
    imdbId?: string;
    originalLanguage?: string;
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

    get logoUrl(): string | undefined {
        return this.props.logoUrl;
    }

    get backdrops(): string[] | undefined {
        return this.props.backdrops;
    }

    get posters(): string[] | undefined {
        return this.props.posters;
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

    get slug(): string | undefined {
        return this.props.slug;
    }

    get originalTitle(): string | undefined {
        return this.props.originalTitle;
    }

    get cast(): string[] | undefined {
        return this.props.cast;
    }

    get director(): string[] | undefined {
        return this.props.director;
    }

    get country(): string[] | undefined {
        return this.props.country;
    }

    get quality(): string | undefined {
        return this.props.quality;
    }

    get lang(): string | undefined {
        return this.props.lang;
    }

    get episodeCurrent(): string | undefined {
        return this.props.episodeCurrent;
    }

    get imdbId(): string | undefined {
        return this.props.imdbId;
    }

    get originalLanguage(): string | undefined {
        return this.props.originalLanguage;
    }

    public static create(id: string, props: MovieProps): Movie {
        return new Movie(id, props);
    }
}
