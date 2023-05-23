import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AddTaskParams } from './dto/addTask.validation';
import { Task, TaskStatus } from './dto/task.entity';
import { TaskTemplate } from './dto/taskTemplate.entity';
import * as jsonschema from 'jsonschema';
import { User } from 'src/user/dto/user.entity';
import { ResolveTaskParams } from './dto/resolveTask.validation';
import { DequeTaskParams } from './dto/dequeTask.validation';

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
      template: {
        visible: true,
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
      template: {
        visible: true,
      },
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

  async dequeOneTask(params: DequeTaskParams): Promise<Task | null> {
    const { templateId, templateName, workerName } = params;
    const theTask = await this.dataSource.transaction(
      async (transactionalEntityManager) => {
        let dequeTask: Task | null = null;
        if (templateId) {
          dequeTask = await transactionalEntityManager
            .createQueryBuilder()
            .select('task')
            .from(Task, 'task')
            .where('templateId = :templateId', { templateId })
            .andWhere('status != :success', { success: TaskStatus.SUCCESS })
            .andWhere('status != :running', { running: TaskStatus.RUNNING })
            .andWhere('status != :pending', { pending: TaskStatus.PENDING })
            .orderBy('createTime', 'ASC')
            .getOne();
        } else if (templateName) {
          dequeTask = await transactionalEntityManager
            .createQueryBuilder()
            .select('task')
            .from(Task, 'task')
            .andWhere('status != :success', { success: TaskStatus.SUCCESS })
            .andWhere('status != :running', { running: TaskStatus.RUNNING })
            .andWhere('status != :pending', { pending: TaskStatus.PENDING })
            .innerJoinAndSelect(
              'task.template',
              'template',
              'template.name = :name',
              { name: templateName },
            )
            .orderBy('createTime', 'ASC')
            .getOne();
        }
        if (!dequeTask) return null;

        dequeTask.status = TaskStatus.PENDING;
        transactionalEntityManager.save(dequeTask);
        return dequeTask;
      },
    );
    return theTask;
  }

  async startTask({ id, progressData }: { id: number; progressData?: string }) {
    const task = await this.getTaskById(id);
    if (!task) {
      throw new BadRequestException(
        `the request task id is not for exist task`,
      );
    }
    task.status = TaskStatus.RUNNING;
    if (progressData) {
      task.progressData = progressData;
    }
    await this.taskRepository.save(task);
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
    task.template = template;
    const savedTask = await this.taskRepository.save(task);
    return savedTask;
  }

  async resolveTask(params: ResolveTaskParams) {
    const { id, resultData } = params;
    const task = await this.getTaskById(id);
    if (!task) {
      throw new BadRequestException(
        `the request task id is not for exist task`,
      );
    }
    const validateResult = await this.validator.validate(
      JSON.parse(resultData),
      JSON.parse(task.template.resultSchema),
    );
    if (!validateResult.valid) {
      throw new BadRequestException(
        `the data is not satisfied by schema of template[${task.template.id}]{${task.template.name}}`,
      );
    }
    task.status = TaskStatus.SUCCESS;
    task.resultData = resultData;
  }

  async rejectTask({ id }: { id: number }) {
    const task = await this.getTaskById(id);
    if (!task) {
      throw new BadRequestException(
        `the request task id is not for exist task`,
      );
    }
    task.status = TaskStatus.FAILED;
    await this.taskRepository.save(task);
    return task;
  }
}
