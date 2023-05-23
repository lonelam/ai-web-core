import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthorizedRequest } from 'src/user/auth/interface';
import { UserRole } from 'src/user/dto/user.entity';
import { AddTaskParams } from './dto/addTask.validation';
import { DequeTaskParams } from './dto/dequeTask.validation';
import { ResolveTaskParams } from './dto/resolveTask.validation';
import { Task } from './dto/task.entity';
import { TasksService } from './tasks.service';
import { TemplateService } from './template/template.service';

@Controller('task')
export class TasksController {
  constructor(
    private tasksService: TasksService,
    private templateService: TemplateService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('create')
  addTask(@Body() body: AddTaskParams, @Request() request: AuthorizedRequest) {
    return this.tasksService.addTask({ ...body, user: request.user });
  }

  @HttpCode(HttpStatus.OK)
  @Get('get_tasks')
  getAllTasks(@Request() request: AuthorizedRequest) {
    return this.tasksService.getAllTasksByUserId(request.user_id);
  }

  @HttpCode(HttpStatus.OK)
  @Get('templates')
  getAllTemplates() {
    return this.templateService.getVisibleTemplates();
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getTask(
    @Param('id') id: number,
    @Request() request: AuthorizedRequest,
  ) {
    let task: Task | null;
    if (request.user.role !== UserRole.ADMIN) {
      task = await this.tasksService.getTaskByNormalUser(id, request.user_id);
    } else {
      task = await this.tasksService.getTaskById(id);
    }
    if (!task) {
      throw new NotFoundException();
    }
    return task;
  }

  @HttpCode(HttpStatus.OK)
  @Post('deque')
  async dequeTask(
    @Request() request: AuthorizedRequest,
    @Body() body: DequeTaskParams,
  ) {
    if (request.user.role !== UserRole.TASK_SLAVE) {
      throw new UnauthorizedException(
        'task can only be fetched by task slave users',
      );
    }
    const task = await this.tasksService.dequeOneTask(body);
    if (!task) {
      throw new NotFoundException(`the queue is empty now`);
    }
    return task;
  }

  @HttpCode(HttpStatus.OK)
  @Post('resolve')
  async resolveTask(
    @Request() request: AuthorizedRequest,
    @Body() body: ResolveTaskParams,
  ) {
    if (request.user.role !== UserRole.TASK_SLAVE) {
      throw new UnauthorizedException(
        'task can only be resolved by task slave users',
      );
    }
    await this.tasksService.resolveTask(body);
  }
}
