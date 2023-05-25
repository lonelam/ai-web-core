import { Authority } from './user/dto/authority.entity';
import { User } from './user/dto/user.entity';
import { Task } from './tasks/dto/task.entity';
import { TaskWorker } from './tasks/dto/taskWorker.entity';
import { TaskTemplate } from './tasks/dto/taskTemplate.entity';
import { TaskTemplateMeta } from './tasks/dto/taskTemplateMeta.entity';
import { DataSourceOptions } from 'typeorm';
export const dataSourceConfig: DataSourceOptions = {
  type: 'mariadb',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_DATABASE || 'aiweb',
  entities: [Authority, User, Task, TaskTemplate, TaskWorker, TaskTemplateMeta],
  migrations: ['dist/db/migrations/*'],
  migrationsRun: true,
  synchronize: process.env.NODE_ENV === 'development',
  logging:
    process.env.NODE_ENV === 'development'
      ? true
      : ['schema', 'error', 'warn', 'info', 'log', 'migration'],
  // synchronize: true,
};
export default dataSourceConfig;
