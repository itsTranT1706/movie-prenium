import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/prisma';
import { User, UserRole, UserRepositoryPort } from '../../domain';

/**
 * Prisma User Repository Adapter
 * Infrastructure implements HOW domain operations work using Prisma
 */
@Injectable()
export class PrismaUserRepository implements UserRepositoryPort {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!user) return null;

        return this.toDomain(user);
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) return null;

        return this.toDomain(user);
    }

    async findAll(): Promise<User[]> {
        const users = await this.prisma.user.findMany();
        return users.map(this.toDomain);
    }

    async save(entity: User): Promise<User> {
        const data = {
            email: entity.email,
            password: entity.password,
            name: entity.name,
            avatar: entity.avatar,
            role: entity.role,
        };

        const user = await this.prisma.user.upsert({
            where: { id: entity.id },
            update: data,
            create: { id: entity.id, ...data },
        });

        return this.toDomain(user);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.user.delete({
            where: { id },
        });
    }

    async exists(id: string): Promise<boolean> {
        const count = await this.prisma.user.count({
            where: { id },
        });
        return count > 0;
    }

    private toDomain(raw: any): User {
        return User.create(raw.id, {
            email: raw.email,
            password: raw.password,
            name: raw.name,
            avatar: raw.avatar,
            role: raw.role as UserRole,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        });
    }
}
