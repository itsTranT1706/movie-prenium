import { BaseEntity } from '@/shared/domain';

export interface WatchHistoryProps {
    userId: string;
    movieId: string;
    episodeNumber?: number;
    serverName?: string;
    firstWatchedAt: Date;
    lastWatchedAt: Date;
    completed: boolean;
}

export class WatchHistory extends BaseEntity<string> {
    private props: WatchHistoryProps;

    private constructor(id: string, props: WatchHistoryProps) {
        super(id);
        this.props = props;
    }

    get userId(): string {
        return this.props.userId;
    }

    get movieId(): string {
        return this.props.movieId;
    }

    get episodeNumber(): number | undefined {
        return this.props.episodeNumber;
    }

    get serverName(): string | undefined {
        return this.props.serverName;
    }

    get firstWatchedAt(): Date {
        return this.props.firstWatchedAt;
    }

    get lastWatchedAt(): Date {
        return this.props.lastWatchedAt;
    }

    get completed(): boolean {
        return this.props.completed;
    }

    public static create(id: string, props: WatchHistoryProps): WatchHistory {
        return new WatchHistory(id, props);
    }

    public updateLastWatched(): void {
        this.props.lastWatchedAt = new Date();
        this.props.completed = false;
    }

    public markAsCompleted(): void {
        this.props.completed = true;
    }
}
