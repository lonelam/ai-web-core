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
import {
  firstValueFrom,
  merge,
  Subject,
  switchMap,
  takeUntil,
  timer,
} from 'rxjs';
type ITaskRequestItem = {
  taskSubject: Subject<Task>;
  retrieveSubject: Subject<void>;
};
@Injectable()
export class TasksService {
  private validator: jsonschema.Validator = new jsonschema.Validator();
  private _waitingRequestQueue: ITaskRequestItem[] = [];
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    @InjectRepository(TaskTemplate)
    private taskTemplateRepository: Repository<TaskTemplate>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  private async _waitForOneTaskForTime(
    timeInMilliseconds: number,
  ): Promise<Task | null> {
    const taskSubject = new Subject<Task>();
    const retrieveSubject = new Subject<void>();
    const item = { taskSubject, retrieveSubject };
    this._waitingRequestQueue.push(item);
    const task = await firstValueFrom(
      taskSubject.pipe(
        switchMap((task) => {
          return merge(
            [task],
            timer(timeInMilliseconds).pipe(
              takeUntil(retrieveSubject),
              switchMap(() => {
                const itemIndex = this._waitingRequestQueue.indexOf(item);
                if (itemIndex !== -1) {
                  this._waitingRequestQueue.splice(itemIndex, 1);
                }
                return [null];
              }),
            ),
          );
        }),
      ),
    );
    return task;
  }

  async getAllTasksByNormalUser(userId: number): Promise<Task[]> {
    let visibleTasks: Task[] = [];
    this.dataSource.transaction(async (transactionalEntityManager) => {
      visibleTasks = await transactionalEntityManager.findBy(Task, {
        creator: {
          id: userId,
        },
        template: {
          visible: true,
        },
      });
      for (const task of visibleTasks) {
        if (
          [TaskStatus.PENDING, TaskStatus.RUNNING].includes(task.status) &&
          Date.now() - task.updateTime.valueOf() > 60 * 1000
        ) {
          task.status = TaskStatus.QUEUEING;
        }
        await transactionalEntityManager.save(task);
      }
    });
    return visibleTasks;
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
    const { templateId, templateName, workerName, waitTimeout } = params;
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
        dequeTask = await transactionalEntityManager.save(dequeTask);
        return dequeTask;
      },
    );
    if (!theTask) {
      return this._waitForOneTaskForTime(waitTimeout || 1000);
    }
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
    const waitingRequest = this._waitingRequestQueue.shift();
    if (waitingRequest) {
      waitingRequest?.retrieveSubject.next();
      task.status = TaskStatus.PENDING;
    }
    const savedTask = await this.taskRepository.save(task);
    waitingRequest?.taskSubject.next(savedTask);
    return savedTask;
  }

  async resolveTask(params: ResolveTaskParams) {
    const { id, resultData } = params;
    const task = await this.taskRepository.findOne({
      relations: {
        template: true,
      },
      where: {
        id,
      },
    });

    if (!task) {
      throw new BadRequestException(
        `the request task id is not for exist task`,
      );
    }
    let parsedResultData;
    try {
      parsedResultData = JSON.parse(resultData);
    } catch (err) {
      throw new BadRequestException(`the request resultData is not valid JSON`);
    }
    let parsedResultSchema;
    try {
      parsedResultSchema = JSON.parse(task.template.resultSchema);
    } catch (err) {
      throw new BadRequestException(
        `the request task's resultSchema is not valid JSON`,
      );
    }

    const validateResult = await this.validator.validate(
      parsedResultData,
      parsedResultSchema,
    );

    if (!validateResult.valid) {
      throw new BadRequestException(
        `the data is not satisfied by schema of template[${task.template.id}]{${task.template.name}}`,
      );
    }
    task.status = TaskStatus.SUCCESS;
    task.resultData = resultData;
    const resultTask = await this.taskRepository.save(task);
    return resultTask;
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
