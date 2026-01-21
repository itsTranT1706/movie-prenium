import { Module, Global } from '@nestjs/common';
import { TMDBConfigService } from './tmdb.config';
import { TMDBApiClient } from './tmdb-api.client';

@Global()
@Module({
    providers: [TMDBConfigService, TMDBApiClient],
    exports: [TMDBConfigService, TMDBApiClient],
})
export class TMDBModule { }
