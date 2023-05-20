import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsJSON } from 'class-validator';

export class ResolveTaskParams {
  @IsInt()
  @ApiProperty()
  id: number;

  @IsJSON()
  @ApiProperty()
  resultData: string;
}
