/**
 * Password Service Port - Abstraction for password hashing
 */
export interface PasswordServicePort {
    hash(password: string): Promise<string>;
    compare(password: string, hashedPassword: string): Promise<boolean>;
}

export const PASSWORD_SERVICE = Symbol('PASSWORD_SERVICE');
