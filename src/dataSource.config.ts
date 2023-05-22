import { Authority } from './user/dto/authority.entity';
import { User } from './user/dto/user.entity';
import { Task } from './tasks/dto/task.entity';
import { TaskWorker } from './tasks/dto/taskWorker.entity';
import { TaskTemplate } from './tasks/dto/taskTemplate.entity';
import { TaskTemplateMeta } from './tasks/dto/taskTemplateMeta.entity';
import { DataSourceOptions } from 'typeorm';
export const dataSourceConfig: DataSourceOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'aiweb',
  entities: [Authority, User, Task, TaskTemplate, TaskWorker, TaskTemplateMeta],
  migrations: ['dist/db/migrations/*'],
  migrationsRun: true,
  migrationsTableName: 'custom_migration_table',
  synchronize: process.env.NODE_ENV === 'development',
  logging: true,
  // synchronize: true,
};
export default dataSourceConfig;
