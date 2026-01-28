import { Inject, Injectable } from '@nestjs/common';
import { Result } from '@/shared/domain';
import { User, USER_REPOSITORY, UserRepositoryPort } from '../../domain';
import { PASSWORD_SERVICE, PasswordServicePort } from '@/modules/auth/domain/ports';

export interface ChangePasswordInput {
    userId: string;
    currentPassword: string;
    newPassword: string;
}

/**
 * Change Password Use Case
 * Application layer orchestrates domain operations for changing user password
 */
@Injectable()
export class ChangePasswordUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepositoryPort,
        @Inject(PASSWORD_SERVICE)
        private readonly passwordService: PasswordServicePort,
    ) { }

    async execute(input: ChangePasswordInput): Promise<Result<void>> {
        const user = await this.userRepository.findById(input.userId);

        if (!user) {
            return Result.fail(new Error('User not found'));
        }

        // Verify current password
        const isPasswordValid = await this.passwordService.compare(
            input.currentPassword,
            user.password,
        );

        if (!isPasswordValid) {
            return Result.fail(new Error('Current password is incorrect'));
        }

        // Hash new password
        const hashedPassword = await this.passwordService.hash(input.newPassword);

        // Update user password
        user.updatePassword(hashedPassword);

        // Persist changes via repository
        await this.userRepository.update(user);

        return Result.ok(undefined);
    }
}
