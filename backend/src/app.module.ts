import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './shared/infrastructure/prisma';
import { TMDBModule } from './shared/infrastructure/tmdb';

// Domain Modules
import { AuthModule } from './modules/auth/infrastructure/auth.module';
import { UserModule } from './modules/user/infrastructure/user.module';
import { MovieModule } from './modules/movie/infrastructure/movie.module';
import { FavoriteModule } from './modules/favorite/infrastructure/favorite.module';
import { WatchHistoryModule } from './modules/watch-history/infrastructure/watch-history.module';
import { StreamingModule } from './modules/streaming/infrastructure/streaming.module';
import { RecommendationModule } from './modules/recommendation/infrastructure/recommendation.module';
import { AIModule } from './modules/ai/infrastructure/ai.module';
import { CommentModule } from './modules/comment/infrastructure/comment.module';
import { TopBannerModule } from './modules/top-banner/infrastructure/top-banner.module';
import { YoutubeModule } from './modules/youtube/youtube.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database & External Services
    PrismaModule,
    TMDBModule,

    // Business Modules
    AuthModule,
    UserModule,
    MovieModule,
    FavoriteModule,
    WatchHistoryModule,
    StreamingModule,
    RecommendationModule,
    CommentModule,
    TopBannerModule,
    YoutubeModule,

    // AI Module (Stub)
    AIModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
