import { RepositoryPort } from '@/shared/ports';
import { User } from '../entities/user.entity';

/**
 * User Repository Port - Domain defines what operations are needed
 * Infrastructure will implement HOW these operations work
 */
export interface UserRepositoryPort extends RepositoryPort<User, string> {
    findByEmail(email: string): Promise<User | null>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
