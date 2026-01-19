import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { GetStreamUseCase } from '../../application';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards';

@Controller('streaming')
@UseGuards(JwtAuthGuard)
export class StreamingController {
    constructor(private readonly getStreamUseCase: GetStreamUseCase) { }

    @Get(':movieId')
    async getStream(@Req() req: any, @Param('movieId') movieId: string) {
        const result = await this.getStreamUseCase.execute({
            userId: req.user.userId,
            movieId,
        });

        if (result.isFailure) {
            return { success: false, error: result.error.message };
        }

        return {
            success: true,
            data: result.value,
        };
    }
}
