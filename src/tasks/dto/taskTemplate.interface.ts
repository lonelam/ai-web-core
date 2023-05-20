import { TaskTemplate } from './taskTemplate.entity';

export type ICreateTemplate = Pick<
  TaskTemplate,
  'name' | 'dataSchema' | 'resultSchema'
>;

export type IUpdateTemplate = Partial<
  Pick<TaskTemplate, 'name' | 'dataSchema' | 'resultSchema'>
> &
  Pick<TaskTemplate, 'id'>;
