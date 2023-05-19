import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { AuthorizedRequest } from 'src/user/auth/interface';
import { UserRole } from 'src/user/dto/user.entity';
import { AddTaskParams } from './dto/addTask.validation';
import { Task } from './dto/task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post('add_task')
  addTask(@Body() body: AddTaskParams, @Request() request: AuthorizedRequest) {
    return this.tasksService.addTask({ ...body, user: request.user });
  }

  @Get('get_tasks')
  getAllTasks(@Request() request: AuthorizedRequest) {
    return this.tasksService.getAllTasksByUserId(request.user_id);
  }

  @Get('task/:id')
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
}
