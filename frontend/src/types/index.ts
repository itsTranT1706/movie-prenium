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
    releaseDate?: string;
    duration?: number;
    rating?: number;
    genres: string[];
    cast?: string[];
    director?: string[];
    country?: string[];
    quality?: string;
    lang?: string;
    episodeCurrent?: string;
    ageRating?: string;
}

export interface MovieWithSources extends Movie {
    sources: StreamSource[];
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

export interface MovieCast {
    id: number;
    name: string;
    originalName: string;
    character: string;
    profileUrl: string | null;
    order: number;
}

export interface ActorProfile {
    id: number;
    name: string;
    biography: string;
    birthday: string | null;
    deathday: string | null;
    placeOfBirth: string | null;
    profileUrl: string | null;
    knownForDepartment: string;
    movies: Movie[];
}

