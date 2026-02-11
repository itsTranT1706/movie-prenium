import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { YoutubeController } from './youtube.controller';
import { YoutubeService } from './youtube.service';
import { MovieModule } from '../movie/infrastructure/movie.module';

@Module({
    imports: [HttpModule, MovieModule],
    controllers: [YoutubeController],
    providers: [YoutubeService],
    exports: [YoutubeService],
})
export class YoutubeModule { }
