/**
 * Streaming Provider Port - Abstraction for streaming services
 * 
 * TODAY: External streaming APIs or CDN
 * TOMORROW: Self-hosted streaming infrastructure
 * 
 * This port ensures we are PROVIDER-AGNOSTIC for streaming
 */
export interface StreamingProviderPort {
    getStreamUrl(movieId: string): Promise<string | null>;
    getStreamManifest(movieId: string): Promise<StreamManifest | null>;
    validateAccess(userId: string, movieId: string): Promise<boolean>;
}

export interface StreamManifest {
    url: string;
    type: 'hls' | 'dash' | 'progressive';
    qualities: StreamQuality[];
}

export interface StreamQuality {
    resolution: string; // e.g., '1080p', '720p'
    bitrate: number;
    url: string;
}

export const STREAMING_PROVIDER = Symbol('STREAMING_PROVIDER');
