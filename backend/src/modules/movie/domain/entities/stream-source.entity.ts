import { Episode } from './episode.entity';

export interface StreamSourceProps {
    provider: 'kkphim' | 'nguonc' | string;
    serverName: string;         // "Vietsub #1", "Lồng Tiếng #1"
    quality: string;            // "FHD", "HD"
    language: string;           // "Vietsub", "Thuyết Minh", "Lồng Tiếng"
    episodes: Episode[];
}

/**
 * StreamSource Value Object - Represents a streaming source from a provider
 * 
 * Contains server info and list of episodes with their stream URLs.
 * Multiple StreamSources can exist for same movie (different servers/languages).
 */
export class StreamSource {
    private props: StreamSourceProps;

    private constructor(props: StreamSourceProps) {
        this.props = props;
    }

    get provider(): string {
        return this.props.provider;
    }

    get serverName(): string {
        return this.props.serverName;
    }

    get quality(): string {
        return this.props.quality;
    }

    get language(): string {
        return this.props.language;
    }

    get episodes(): Episode[] {
        return this.props.episodes;
    }

    public static create(props: StreamSourceProps): StreamSource {
        return new StreamSource(props);
    }
}
