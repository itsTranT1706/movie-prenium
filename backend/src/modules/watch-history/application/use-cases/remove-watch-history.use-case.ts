import { Inject, Injectable } from '@nestjs/common';
import {
    WATCH_HISTORY_REPOSITORY,
    WatchHistoryRepository,
} from '../../domain';

@Injectable()
export class RemoveWatchHistoryUseCase {
    constructor(
        @Inject(WATCH_HISTORY_REPOSITORY)
        private readonly repository: WatchHistoryRepository,
    ) {}

    async execute(
        userId: string,
        movieId: string,
        episodeNumber?: number,
    ) {
        await this.repository.remove(userId, movieId, episodeNumber);
    }
}
