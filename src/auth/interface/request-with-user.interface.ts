import { Request } from 'express';
import { UserRole } from '../../users/user.schema';

export interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
    role: UserRole;
  };
}
