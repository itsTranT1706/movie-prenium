import { Inject, Injectable } from '@nestjs/common';
import { Result } from '@/shared/domain';
import { User, USER_REPOSITORY, UserRepositoryPort } from '../../domain';
import { UpdateUserDto } from '../dto/update-user.dto';

export interface UpdateUserProfileInput {
    userId: string;
    updateData: UpdateUserDto;
}

/**
 * Update User Profile Use Case
 * Application layer orchestrates domain operations for updating user profile
 */
@Injectable()
export class UpdateUserProfileUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepositoryPort,
    ) { }

    async execute(input: UpdateUserProfileInput): Promise<Result<User>> {
        const user = await this.userRepository.findById(input.userId);

        if (!user) {
            return Result.fail(new Error('User not found'));
        }

        // Update user entity with new data
        if (input.updateData.name !== undefined) {
            user.updateName(input.updateData.name);
        }

        if (input.updateData.avatar !== undefined) {
            user.updateAvatar(input.updateData.avatar);
        }

        // Persist changes via repository
        const updatedUser = await this.userRepository.update(user);

        return Result.ok(updatedUser);
    }
}
