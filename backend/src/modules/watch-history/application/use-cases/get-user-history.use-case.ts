import { Inject, Injectable } from '@nestjs/common';
import {
    WATCH_HISTORY_REPOSITORY,
    WatchHistoryRepository,
} from '../../domain';

@Injectable()
export class GetUserHistoryUseCase {
    constructor(
        @Inject(WATCH_HISTORY_REPOSITORY)
        private readonly repository: WatchHistoryRepository,
    ) {}

    async execute(userId: string, limit = 20, offset = 0) {
        return await this.repository.getHistory(userId, limit, offset);
    }
}
