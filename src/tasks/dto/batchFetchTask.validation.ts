import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class BatchFetchTaskParams {
  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  taskIds: number[];
}
