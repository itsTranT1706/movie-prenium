import { Module } from '@nestjs/common';
import { STREAMING_PROVIDER } from '../domain';
import { GetStreamUseCase } from '../application';
import { StubStreamingProvider } from './adapters';
import { StreamingController } from './controllers';

@Module({
    controllers: [StreamingController],
    providers: [
        GetStreamUseCase,
        {
            provide: STREAMING_PROVIDER,
            useClass: StubStreamingProvider,
        },
    ],
    exports: [STREAMING_PROVIDER],
})
export class StreamingModule { }
