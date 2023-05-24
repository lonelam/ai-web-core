import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';

export class DequeTaskParams {
  @ApiProperty()
  @ValidateIf((params) => !params.templateName)
  @IsInt()
  templateId: number;

  @ApiProperty()
  @ValidateIf((params) => !params.templateId)
  @IsNotEmpty()
  templateName: string;

  @ApiProperty()
  @IsNotEmpty()
  workerName: string;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  waitTimeout: number;
}
