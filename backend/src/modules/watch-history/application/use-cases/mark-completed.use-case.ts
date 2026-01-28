import { Inject, Injectable } from '@nestjs/common';
import {
    WATCH_HISTORY_REPOSITORY,
    WatchHistoryRepository,
} from '../../domain';

@Injectable()
export class MarkCompletedUseCase {
    constructor(
        @Inject(WATCH_HISTORY_REPOSITORY)
        private readonly repository: WatchHistoryRepository,
    ) {}

    async execute(
        userId: string,
        movieId: string,
        episodeNumber?: number,
    ) {
        return await this.repository.markAsCompleted(userId, movieId, episodeNumber);
    }
}
