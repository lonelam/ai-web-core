import { IRegisterUser } from './user.interface';
import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserRegisterParams implements IRegisterUser {
  @ApiProperty()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  userName: string;

  @ApiProperty()
  @ValidateIf((o) => o.email)
  @IsEmail()
  email: string;

  @ApiProperty()
  phone?: string;

  @ApiProperty()
  @IsStrongPassword()
  password: string;

  @ApiProperty()
  validateCode?: string;
}
