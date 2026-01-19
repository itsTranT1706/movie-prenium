import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { GetUserByIdUseCase } from '../../application';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards';

@Controller('users')
export class UserController {
    constructor(private readonly getUserByIdUseCase: GetUserByIdUseCase) { }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async getUserById(@Param('id') id: string) {
        const result = await this.getUserByIdUseCase.execute({ userId: id });

        if (result.isFailure) {
            return { success: false, error: result.error.message };
        }

        const user = result.value;
        return {
            success: true,
            data: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                role: user.role,
            },
        };
    }
}
