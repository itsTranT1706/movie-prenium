import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './shared/infrastructure/prisma';
import { TMDBModule } from './shared/infrastructure/tmdb';

// Domain Modules
import { AuthModule } from './modules/auth/infrastructure/auth.module';
import { UserModule } from './modules/user/infrastructure/user.module';
import { MovieModule } from './modules/movie/infrastructure/movie.module';
import { FavoriteModule } from './modules/favorite/infrastructure/favorite.module';
import { StreamingModule } from './modules/streaming/infrastructure/streaming.module';
import { RecommendationModule } from './modules/recommendation/infrastructure/recommendation.module';
import { AIModule } from './modules/ai/infrastructure/ai.module';

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
    StreamingModule,
    RecommendationModule,

    // AI Module (Stub)
    AIModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
