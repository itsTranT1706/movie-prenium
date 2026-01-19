import { Inject, Injectable } from '@nestjs/common';
import { Result } from '@/shared/domain';
import { User, USER_REPOSITORY, UserRepositoryPort } from '../../domain';

export interface GetUserByIdInput {
    userId: string;
}

/**
 * Get User By ID Use Case
 * Application layer orchestrates domain operations
 */
@Injectable()
export class GetUserByIdUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepositoryPort,
    ) { }

    async execute(input: GetUserByIdInput): Promise<Result<User>> {
        const user = await this.userRepository.findById(input.userId);

        if (!user) {
            return Result.fail(new Error('User not found'));
        }

        return Result.ok(user);
    }
}
