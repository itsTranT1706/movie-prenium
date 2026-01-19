import { Inject, Injectable } from '@nestjs/common';
import { Result } from '@/shared/domain';
import { User, USER_REPOSITORY, UserRepositoryPort } from '@/modules/user/domain';
import { TOKEN_SERVICE, TokenServicePort, PASSWORD_SERVICE, PasswordServicePort } from '../../domain';
import { LoginDto } from '../dto';

export interface LoginResult {
    user: User;
    accessToken: string;
}

@Injectable()
export class LoginUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepositoryPort,
        @Inject(TOKEN_SERVICE)
        private readonly tokenService: TokenServicePort,
        @Inject(PASSWORD_SERVICE)
        private readonly passwordService: PasswordServicePort,
    ) { }

    async execute(dto: LoginDto): Promise<Result<LoginResult>> {
        // Find user by email
        const user = await this.userRepository.findByEmail(dto.email);
        if (!user) {
            return Result.fail(new Error('Invalid credentials'));
        }

        // Verify password
        const isPasswordValid = await this.passwordService.compare(dto.password, user.password);
        if (!isPasswordValid) {
            return Result.fail(new Error('Invalid credentials'));
        }

        // Generate token
        const accessToken = this.tokenService.generateAccessToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        return Result.ok({ user, accessToken });
    }
}
