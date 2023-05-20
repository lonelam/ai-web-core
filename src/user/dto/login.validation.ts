import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateIf } from 'class-validator';

export class LoginParams {
  @ApiProperty()
  @ValidateIf((o) => !o.phone && !o.userName)
  @IsNotEmpty()
  email?: string;

  @ApiProperty()
  @ValidateIf((o) => !o.email && !o.userName)
  @IsNotEmpty()
  phone?: string;

  @ApiProperty()
  @ValidateIf((o) => !o.email && !o.phone)
  @IsNotEmpty()
  userName?: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
