import { TaskTemplate } from './taskTemplate.entity';

export type ICreateTemplate = Pick<
  TaskTemplate,
  'name' | 'dataSchema' | 'resultSchema' | 'visible' | 'meta'
>;

export type IUpdateTemplate = Partial<
  Pick<
    TaskTemplate,
    'name' | 'dataSchema' | 'resultSchema' | 'visible' | 'meta'
  >
> &
  Pick<TaskTemplate, 'id'>;

export type IPublicTemplate = Omit<TaskTemplate, 'meta'>;
