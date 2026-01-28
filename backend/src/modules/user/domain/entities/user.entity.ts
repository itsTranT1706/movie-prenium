import { BaseEntity } from '@/shared/domain';

export interface UserProps {
    email: string;
    password: string;
    name?: string;
    avatar?: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}

export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
}

/**
 * User Entity - Framework-agnostic domain entity
 */
export class User extends BaseEntity<string> {
    private props: UserProps;

    private constructor(id: string, props: UserProps) {
        super(id);
        this.props = props;
    }

    get email(): string {
        return this.props.email;
    }

    get password(): string {
        return this.props.password;
    }

    get name(): string | undefined {
        return this.props.name;
    }

    get avatar(): string | undefined {
        return this.props.avatar;
    }

    get role(): UserRole {
        return this.props.role;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }

    public static create(id: string, props: UserProps): User {
        return new User(id, props);
    }

    public updateName(name: string): void {
        this.props.name = name;
    }

    public updateAvatar(avatar: string): void {
        this.props.avatar = avatar;
    }

    public updatePassword(hashedPassword: string): void {
        this.props.password = hashedPassword;
        this.props.updatedAt = new Date();
    }
}
