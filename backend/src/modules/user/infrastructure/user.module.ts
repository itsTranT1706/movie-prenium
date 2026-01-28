import { Module, forwardRef } from '@nestjs/common';
import { USER_REPOSITORY } from '../domain';
import { GetUserByIdUseCase } from '../application';
import { UpdateUserProfileUseCase } from '../application/use-cases/update-user-profile.use-case';
import { ChangePasswordUseCase } from '../application/use-cases/change-password.use-case';
import { PrismaUserRepository } from './adapters';
import { UserController } from './controllers';
import { AuthModule } from '@/modules/auth/infrastructure/auth.module';

@Module({
    imports: [forwardRef(() => AuthModule)],
    controllers: [UserController],
    providers: [
        // Use Cases
        GetUserByIdUseCase,
        UpdateUserProfileUseCase,
        ChangePasswordUseCase,
        // Repository binding (Port -> Adapter)
        {
            provide: USER_REPOSITORY,
            useClass: PrismaUserRepository,
        },
    ],
    exports: [USER_REPOSITORY, GetUserByIdUseCase],
})
export class UserModule { }
