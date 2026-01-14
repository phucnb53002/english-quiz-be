import { UserRole } from 'src/users/user.schema';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}
