import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TOKEN_SERVICE, PASSWORD_SERVICE } from '../domain';
import { RegisterUseCase, LoginUseCase } from '../application';
import { JwtTokenService, BcryptPasswordService } from './adapters';
import { JwtStrategy } from './strategies';
import { AuthController } from './controllers';
import { UserModule } from '@/modules/user/infrastructure/user.module';

@Module({
    imports: [
        forwardRef(() => UserModule),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET') || 'default-secret',
                signOptions: {
                    expiresIn: configService.get<string>('JWT_EXPIRES_IN', '7d') as `${number}d`,
                },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [
        // Use Cases
        RegisterUseCase,
        LoginUseCase,
        // Strategies
        JwtStrategy,
        // Service bindings (Port -> Adapter)
        {
            provide: TOKEN_SERVICE,
            useClass: JwtTokenService,
        },
        {
            provide: PASSWORD_SERVICE,
            useClass: BcryptPasswordService,
        },
    ],
    exports: [TOKEN_SERVICE, PASSWORD_SERVICE, JwtStrategy],
})
export class AuthModule { }
