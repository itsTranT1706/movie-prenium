import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { RegisterUseCase, LoginUseCase, RegisterDto, LoginDto } from '../../application';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly registerUseCase: RegisterUseCase,
        private readonly loginUseCase: LoginUseCase,
    ) { }

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        const result = await this.registerUseCase.execute(dto);

        if (result.isFailure) {
            return { success: false, error: result.error.message };
        }

        const { user, accessToken } = result.value;
        return {
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
                accessToken,
            },
        };
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: LoginDto) {
        const result = await this.loginUseCase.execute(dto);

        if (result.isFailure) {
            return { success: false, error: result.error.message };
        }

        const { user, accessToken } = result.value;
        return {
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
                accessToken,
            },
        };
    }
}
