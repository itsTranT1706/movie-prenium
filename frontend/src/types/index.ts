export interface User {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
    role: 'USER' | 'ADMIN';
}

export interface AuthResponse {
    user: User;
    accessToken: string;
}

export interface Movie {
    id: string;
    externalId?: string;
    title: string;
    mediaType: 'movie' | 'tv';
    description?: string;
    posterUrl?: string;
    backdropUrl?: string;
    releaseDate?: string;
    duration?: number;
    rating?: number;
    genres: string[];
}

export interface StreamSource {
    provider: string;
    serverName: string;
    quality: string;
    language: string;
    episodes: Episode[];
}

export interface Episode {
    episodeNumber: number;
    title?: string;
    slug: string;
    streamUrl?: string;
    embedUrl?: string;
}

export interface Favorite {
    id: string;
    movieId: string;
    createdAt: string;
}
