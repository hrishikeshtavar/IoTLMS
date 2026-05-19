import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;
    const req = context.switchToHttp().getRequest();
    const { user } = req;
    if (!requiredRoles.includes(user?.role)) return false;
    // Admin users must always operate on their own school only
    // Override req.tenantId with admin's JWT tenantId to prevent cross-school access
    if (user?.role === 'admin' && user?.tenantId) {
      req['tenantId'] = user.tenantId;
    }
    return true;
  }
}
