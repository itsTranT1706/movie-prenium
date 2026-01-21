import { BaseEntity } from '@/shared/domain';

export interface EpisodeProps {
    episodeNumber: number;
    title: string;
    slug: string;
    streamUrl: string;      // link_m3u8 (KKPhim) / m3u8 (NguonC)
    embedUrl: string;       // link_embed (KKPhim) / embed (NguonC)
}

/**
 * Episode Entity - Represents a single episode in a TV series
 * 
 * Used by streaming providers to represent individual episodes
 * with their stream URLs and metadata.
 */
export class Episode extends BaseEntity<string> {
    private props: EpisodeProps;

    private constructor(id: string, props: EpisodeProps) {
        super(id);
        this.props = props;
    }

    get episodeNumber(): number {
        return this.props.episodeNumber;
    }

    get title(): string {
        return this.props.title;
    }

    get slug(): string {
        return this.props.slug;
    }

    get streamUrl(): string {
        return this.props.streamUrl;
    }

    get embedUrl(): string {
        return this.props.embedUrl;
    }

    public static create(id: string, props: EpisodeProps): Episode {
        return new Episode(id, props);
    }
}
