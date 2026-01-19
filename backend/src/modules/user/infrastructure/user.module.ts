import { Module } from '@nestjs/common';
import { USER_REPOSITORY } from '../domain';
import { GetUserByIdUseCase } from '../application';
import { PrismaUserRepository } from './adapters';
import { UserController } from './controllers';

@Module({
    controllers: [UserController],
    providers: [
        // Use Cases
        GetUserByIdUseCase,
        // Repository binding (Port -> Adapter)
        {
            provide: USER_REPOSITORY,
            useClass: PrismaUserRepository,
        },
    ],
    exports: [USER_REPOSITORY, GetUserByIdUseCase],
})
export class UserModule { }
