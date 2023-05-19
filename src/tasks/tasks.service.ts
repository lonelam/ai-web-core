import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AddTaskParams } from './dto/addTask.validation';
import { Task, TaskStatus } from './dto/task.entity';
import { TaskTemplate } from './dto/taskTemplate.entity';
import * as jsonschema from 'jsonschema';
import { User } from 'src/user/dto/user.entity';

@Injectable()
export class TasksService {
  private validator: jsonschema.Validator = new jsonschema.Validator();
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    @InjectRepository(TaskTemplate)
    private taskTemplateRepository: Repository<TaskTemplate>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async getAllTasksByUserId(userId: number): Promise<Task[]> {
    return this.taskRepository.findBy({
      creator: {
        id: userId,
      },
    });
  }

  async getTaskByNormalUser(
    taskId: number,
    userId: number,
  ): Promise<Task | null> {
    return this.taskRepository.findOneBy({
      creator: {
        id: userId,
      },
      id: taskId,
    });
  }

  async getTaskById(taskId: number): Promise<Task | null> {
    return this.taskRepository.findOneBy({
      id: taskId,
    });
  }

  async getAllTasks(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  async dequeOneTask(): Promise<Task | null> {
    const theTask = await this.dataSource.transaction(
      async (transactionalEntityManager) => {
        const dequeTask = await transactionalEntityManager
          .createQueryBuilder()
          .select('task')
          .from(Task, 'task')
          .where({ status: TaskStatus.QUEUEING })
          .orderBy('createTime', 'DESC')
          .getOne();
        if (!dequeTask) return null;
        dequeTask.status = TaskStatus.PENDING;
        transactionalEntityManager.save(dequeTask);
        return dequeTask;
      },
    );
    return theTask;
  }

  async getTasksByStatus({ status }: { status: TaskStatus }): Promise<Task[]> {
    return this.taskRepository.findBy({
      status: status,
    });
  }

  async getTemplateById({ id }: { id: number }): Promise<TaskTemplate | null> {
    return this.taskTemplateRepository.findOneBy({
      id,
    });
  }

  async addTask(params: AddTaskParams & { user: User }): Promise<Task> {
    const { name, data, templateId, user } = params;
    const template = await this.getTemplateById({ id: templateId });
    if (!template) {
      throw new BadRequestException(`the template[${templateId}] not exists!`);
    }
    const validateResult = await this.validator.validate(
      JSON.parse(data),
      JSON.parse(template.dataSchema),
    );
    if (!validateResult.valid) {
      throw new BadRequestException(
        `the data is not satisfied by schema of template[${templateId}]`,
      );
    }
    const task = new Task();
    task.creator = user;
    task.data = data;
    task.name = name;
    const savedTask = await this.taskRepository.save(task);
    return savedTask;
  }
}
