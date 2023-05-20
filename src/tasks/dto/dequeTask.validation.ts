import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class DequeTaskParams {
  @ApiProperty()
  @IsInt()
  templateId: number;

  @ApiProperty()
  @IsNotEmpty()
  workerName: string;
}
