import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Body,
    Query,
    UseGuards,
    Req,
    Param,
    ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-auth.guard';
import {
    AddWatchHistoryUseCase,
    MarkCompletedUseCase,
    GetContinueWatchingUseCase,
    GetUserHistoryUseCase,
    RemoveWatchHistoryUseCase,
} from '../../application';

@Controller('watch-history')
@UseGuards(JwtAuthGuard)
export class WatchHistoryController {
    constructor(
        private readonly addWatchHistoryUseCase: AddWatchHistoryUseCase,
        private readonly markCompletedUseCase: MarkCompletedUseCase,
        private readonly getContinueWatchingUseCase: GetContinueWatchingUseCase,
        private readonly getUserHistoryUseCase: GetUserHistoryUseCase,
        private readonly removeWatchHistoryUseCase: RemoveWatchHistoryUseCase,
    ) {}

    @Post()
    async addWatchHistory(
        @Req() req: any,
        @Body() body: { movieId: string; episodeNumber?: number; movieData?: any },
    ) {
        console.log('🔐 [WatchHistory] Request user:', req.user);
        console.log('📦 [WatchHistory] Raw body received:', JSON.stringify(body, null, 2));
        
        // JWT payload uses 'userId' not 'id'
        const userId = req.user?.userId || req.user?.id;
        
        if (!userId) {
            console.error('❌ [WatchHistory] No userId found in request');
            throw new Error('User not authenticated');
        }
        
        console.log('🎬 [WatchHistory] Adding watch history:', {
            userId,
            movieId: body.movieId,
            episodeNumber: body.episodeNumber,
            hasMovieData: !!body.movieData,
            movieDataKeys: body.movieData ? Object.keys(body.movieData) : [],
        });
        
        try {
            const result = await this.addWatchHistoryUseCase.execute(
                userId,
                body.movieId,
                body.episodeNumber,
                body.movieData,
            );
            console.log('✅ [WatchHistory] Successfully added:', result);
            return result;
        } catch (error) {
            console.error('❌ [WatchHistory] Failed to add:', error);
            throw error;
        }
    }

    @Patch('complete')
    async markCompleted(
        @Req() req: any,
        @Body() body: { movieId: string; episodeNumber?: number },
    ) {
        const userId = req.user?.userId || req.user?.id;
        return await this.markCompletedUseCase.execute(
            userId,
            body.movieId,
            body.episodeNumber,
        );
    }

    @Get('continue')
    async getContinueWatching(
        @Req() req: any,
        @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    ) {
        const userId = req.user?.userId || req.user?.id;
        return await this.getContinueWatchingUseCase.execute(userId, limit);
    }

    @Get()
    async getHistory(
        @Req() req: any,
        @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
        @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
    ) {
        const userId = req.user?.userId || req.user?.id;
        return await this.getUserHistoryUseCase.execute(userId, limit, offset);
    }

    @Delete()
    async removeWatchHistory(
        @Req() req: any,
        @Body() body: { movieId: string; episodeNumber?: number },
    ) {
        const userId = req.user?.userId || req.user?.id;
        await this.removeWatchHistoryUseCase.execute(
            userId,
            body.movieId,
            body.episodeNumber,
        );
        return { message: 'Watch history removed successfully' };
    }
}
