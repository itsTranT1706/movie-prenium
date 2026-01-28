import { Inject, Injectable } from '@nestjs/common';
import {
    WATCH_HISTORY_REPOSITORY,
    WatchHistoryRepository,
} from '../../domain';

@Injectable()
export class AddWatchHistoryUseCase {
    constructor(
        @Inject(WATCH_HISTORY_REPOSITORY)
        private readonly repository: WatchHistoryRepository,
    ) {}

    async execute(
        userId: string,
        movieId: string,
        episodeNumber?: number,
        movieData?: any,
    ) {
        return await this.repository.addOrUpdate(userId, movieId, episodeNumber, movieData);
    }
}
