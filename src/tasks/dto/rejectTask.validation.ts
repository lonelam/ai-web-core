import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsJSON } from 'class-validator';

export class RejectTaskParams {
  @IsInt()
  @ApiProperty()
  id: number;
}
