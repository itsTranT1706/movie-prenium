import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => {
    return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
        if (propertyKey) {
            Reflect.defineMetadata(ROLES_KEY, roles, descriptor!.value);
        } else {
            Reflect.defineMetadata(ROLES_KEY, roles, target);
        }
        return descriptor || target;
    };
};

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        if (!user) {
            return false;
        }

        return requiredRoles.some((role) => user.role === role);
    }
}
