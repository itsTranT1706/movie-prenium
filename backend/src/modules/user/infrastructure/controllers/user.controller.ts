import { Controller, Get, Param, UseGuards, Patch, Body, Req, ForbiddenException, BadRequestException } from '@nestjs/common';
import { GetUserByIdUseCase } from '../../application';
import { UpdateUserProfileUseCase } from '../../application/use-cases/update-user-profile.use-case';
import { ChangePasswordUseCase } from '../../application/use-cases/change-password.use-case';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards';
import { UpdateUserDto } from '../../application/dto/update-user.dto';
import { ChangePasswordDto } from '../../application/dto/change-password.dto';

@Controller('users')
export class UserController {
    constructor(
        private readonly getUserByIdUseCase: GetUserByIdUseCase,
        private readonly updateUserProfileUseCase: UpdateUserProfileUseCase,
        private readonly changePasswordUseCase: ChangePasswordUseCase,
    ) { }

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

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async updateUserProfile(
        @Req() req: any,
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        // Authorization check: user can only update their own profile
        if (req.user.userId !== id) {
            throw new ForbiddenException('You can only update your own profile');
        }

        const result = await this.updateUserProfileUseCase.execute({
            userId: id,
            updateData: updateUserDto,
        });

        if (result.isFailure) {
            throw new BadRequestException(result.error.message);
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

    @Patch(':id/password')
    @UseGuards(JwtAuthGuard)
    async changePassword(
        @Req() req: any,
        @Param('id') id: string,
        @Body() changePasswordDto: ChangePasswordDto,
    ) {
        // Authorization check: user can only change their own password
        if (req.user.userId !== id) {
            throw new ForbiddenException('You can only change your own password');
        }

        const result = await this.changePasswordUseCase.execute({
            userId: id,
            currentPassword: changePasswordDto.currentPassword,
            newPassword: changePasswordDto.newPassword,
        });

        if (result.isFailure) {
            throw new BadRequestException(result.error.message);
        }

        return {
            success: true,
            message: 'Password changed successfully',
        };
    }
}
