import { Controller, Get, Query } from '@nestjs/common';
import { YoutubeService } from './youtube.service';

@Controller('youtube')
export class YoutubeController {
    constructor(private readonly youtubeService: YoutubeService) { }

    @Get('shorts')
    async getShorts(
        @Query('mode') mode: 'random' | 'related' = 'random',
        @Query('query') query?: string,
    ) {
        return this.youtubeService.getShorts(mode, query);
    }
}
