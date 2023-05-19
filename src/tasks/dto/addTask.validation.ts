import { IsInt, IsJSON, IsNotEmpty } from 'class-validator';

export class AddTaskParams {
  @IsNotEmpty()
  name: string;
  @IsJSON()
  data: string;
  @IsInt()
  templateId: number;
}
