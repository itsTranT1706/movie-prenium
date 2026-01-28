import { Module } from '@nestjs/common';
import { PrismaModule } from '@/shared/infrastructure/prisma/prisma.module';
import { WATCH_HISTORY_REPOSITORY } from '../domain';
import { PrismaWatchHistoryRepository } from './adapters/prisma-watch-history.repository';
import {
    AddWatchHistoryUseCase,
    MarkCompletedUseCase,
    GetContinueWatchingUseCase,
    GetUserHistoryUseCase,
    RemoveWatchHistoryUseCase,
} from '../application';
import { WatchHistoryController } from './controllers/watch-history.controller';

@Module({
    imports: [PrismaModule],
    controllers: [WatchHistoryController],
    providers: [
        {
            provide: WATCH_HISTORY_REPOSITORY,
            useClass: PrismaWatchHistoryRepository,
        },
        AddWatchHistoryUseCase,
        MarkCompletedUseCase,
        GetContinueWatchingUseCase,
        GetUserHistoryUseCase,
        RemoveWatchHistoryUseCase,
    ],
    exports: [
        AddWatchHistoryUseCase,
        MarkCompletedUseCase,
        GetContinueWatchingUseCase,
        GetUserHistoryUseCase,
        RemoveWatchHistoryUseCase,
    ],
})
export class WatchHistoryModule {}
