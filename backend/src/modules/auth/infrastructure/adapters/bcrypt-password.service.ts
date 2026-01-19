import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PasswordServicePort } from '../../domain';

@Injectable()
export class BcryptPasswordService implements PasswordServicePort {
    private readonly saltRounds = 10;

    async hash(password: string): Promise<string> {
        return bcrypt.hash(password, this.saltRounds);
    }

    async compare(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }
}
