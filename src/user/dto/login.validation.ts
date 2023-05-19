import { IsNotEmpty, ValidateIf } from 'class-validator';

export class LoginParams {
  @ValidateIf((o) => !o.phone && !o.userName)
  @IsNotEmpty()
  email?: string;

  @ValidateIf((o) => !o.email && !o.userName)
  @IsNotEmpty()
  phone?: string;

  @ValidateIf((o) => !o.email && !o.phone)
  @IsNotEmpty()
  userName?: string;

  @IsNotEmpty()
  password: string;
}
