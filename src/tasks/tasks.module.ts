import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './dto/task.entity';
import { TaskTemplate } from './dto/taskTemplate.entity';
import { TaskWorker } from './dto/taskWorker.entity';
import { UserModule } from 'src/user/user.module';
import { WorkerService } from './worker/worker.service';
import { TemplateService } from './template/template.service';
import { TaskTemplateMeta } from './dto/taskTemplateMeta.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Task,
      TaskTemplate,
      TaskWorker,
      TaskTemplateMeta,
    ]),
    UserModule,
  ],
  providers: [TasksService, WorkerService, TemplateService],
  controllers: [TasksController],
  exports: [TasksService, WorkerService, TemplateService],
})
export class TasksModule {}
