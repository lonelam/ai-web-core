import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { TasksModule } from './tasks/tasks.module';
import { Authority } from './user/dto/authority.entity';
import { User } from './user/dto/user.entity';
import { Task } from './tasks/dto/task.entity';
import { TaskWorker } from './tasks/dto/taskWorker.entity';
import { TaskTemplate } from './tasks/dto/taskTemplate.entity';
import { AdminModule } from './admin/admin.module';
import { TaskTemplateMeta } from './tasks/dto/taskTemplateMeta.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [
        Authority,
        User,
        Task,
        TaskTemplate,
        TaskWorker,
        TaskTemplateMeta,
      ],
      synchronize: process.env.NODE_ENV === 'development',
      // logging: true,
      // synchronize: true,
    }),
    UserModule,
    TasksModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
