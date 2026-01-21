import { IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { IsStrongPassword } from '../../auth/decorators/strong-password.decorator';
import { UserRole } from '../user.schema';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Name must not exceed 50 characters' })
  name: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsStrongPassword({ message: 'Password does not meet security requirements' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  role?: UserRole;
}
