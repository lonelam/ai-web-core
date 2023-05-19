import { IRegisterUser } from './user.interface';
import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  ValidateIf,
} from 'class-validator';
export class UserRegisterParams implements IRegisterUser {
  @IsNotEmpty()
  firstName: string;
  @IsNotEmpty()
  lastName: string;
  @IsNotEmpty()
  userName: string;
  @ValidateIf((o) => o.email)
  @IsEmail()
  email: string;
  @IsStrongPassword()
  password: string;
}
