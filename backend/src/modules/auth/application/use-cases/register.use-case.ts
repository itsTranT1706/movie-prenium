import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Result } from '@/shared/domain';
import { User, UserRole, USER_REPOSITORY, UserRepositoryPort } from '@/modules/user/domain';
import { TOKEN_SERVICE, TokenServicePort, PASSWORD_SERVICE, PasswordServicePort } from '../../domain';
import { RegisterDto } from '../dto';

export interface RegisterResult {
    user: User;
    accessToken: string;
}

@Injectable()
export class RegisterUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepositoryPort,
        @Inject(TOKEN_SERVICE)
        private readonly tokenService: TokenServicePort,
        @Inject(PASSWORD_SERVICE)
        private readonly passwordService: PasswordServicePort,
    ) { }

    async execute(dto: RegisterDto): Promise<Result<RegisterResult>> {
        // Check if user already exists
        const existingUser = await this.userRepository.findByEmail(dto.email);
        if (existingUser) {
            return Result.fail(new Error('Email already registered'));
        }

        // Hash password
        const hashedPassword = await this.passwordService.hash(dto.password);

        // Create user entity
        const user = User.create(uuidv4(), {
            email: dto.email,
            password: hashedPassword,
            name: dto.name,
            role: UserRole.USER,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Save user
        await this.userRepository.save(user);

        // Generate token
        const accessToken = this.tokenService.generateAccessToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        return Result.ok({ user, accessToken });
    }
}
