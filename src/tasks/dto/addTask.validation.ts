import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsJSON, IsNotEmpty } from 'class-validator';

export class AddTaskParams {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsJSON()
  data: string;

  @ApiProperty()
  @IsInt()
  templateId: number;
}
