import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsJSON, IsNotEmpty, ValidateIf } from 'class-validator';

export class AddTaskParams {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsJSON()
  data: string;

  @ApiProperty()
  @ValidateIf((params: AddTaskParams) => !params.templateName)
  @IsInt()
  templateId: number;

  @ApiProperty()
  @ValidateIf((params: AddTaskParams) => !params.templateId)
  @IsNotEmpty()
  templateName: string;
}
