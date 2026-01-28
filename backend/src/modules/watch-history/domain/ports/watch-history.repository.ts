import { WatchHistory } from '../entities/watch-history.entity';

export interface WatchHistoryRepository {
    addOrUpdate(
        userId: string,
        movieId: string,
        episodeNumber?: number,
        movieData?: any,
    ): Promise<WatchHistory>;

    markAsCompleted(
        userId: string,
        movieId: string,
        episodeNumber?: number,
    ): Promise<WatchHistory>;

    getContinueWatching(userId: string, limit?: number): Promise<any[]>;

    getHistory(
        userId: string,
        limit?: number,
        offset?: number,
    ): Promise<any[]>;

    remove(
        userId: string,
        movieId: string,
        episodeNumber?: number,
    ): Promise<void>;
}

export const WATCH_HISTORY_REPOSITORY = Symbol('WATCH_HISTORY_REPOSITORY');
