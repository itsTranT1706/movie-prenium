export interface User {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
    role: 'USER' | 'ADMIN';
}

export interface Movie {
    id: string;
    externalId?: string;
    title: string;
    description?: string;
    posterUrl?: string;
    backdropUrl?: string;
    releaseDate?: string;
    duration?: number;
    rating?: number;
    genres: string[];
}

export interface Favorite {
    id: string;
    movieId: string;
    createdAt: string;
}

export interface StreamManifest {
    url: string;
    type: 'hls' | 'dash' | 'progressive';
    qualities: {
        resolution: string;
        bitrate: number;
        url: string;
    }[];
}
