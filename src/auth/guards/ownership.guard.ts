import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RequestWithUser } from '../interface/request-with-user.interface';
import { UserRole } from '../../users/user.schema';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const { user } = request;
    const resourceId = request.params.id;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (user.role === UserRole.ADMIN) {
      return true;
    }

    if (user.userId !== resourceId) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }
}
