import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    // Desafio Extra: Administradores sempre possuem livre acesso a qualquer rota
    if (user.roles?.includes('ADMIN')) {
      return true;
    }

    if (!requiredRoles) {
      return true;
    }

    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
