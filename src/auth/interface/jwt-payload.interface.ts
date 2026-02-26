import { UserRole } from 'src/users/user.schema';

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}
