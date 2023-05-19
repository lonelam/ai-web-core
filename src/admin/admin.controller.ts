import { Controller, Get } from '@nestjs/common';
import { TasksService } from 'src/tasks/tasks.service';
import { AuthService } from 'src/user/auth/auth.service';
import { Admin } from 'src/user/auth/constants';
import { User } from 'src/user/dto/user.entity';

@Admin()
@Controller('admin')
export class AdminController {
  constructor(
    private authService: AuthService,
    private tasksService: TasksService,
  ) {}
  @Get('users')
  async getAllUsers(): Promise<{ users: User[] }> {
    return this.authService.getAllUsers();
  }
  @Get('tasks')
  async getAllTasks() {
    return this.tasksService.getAllTasks();
  }
}
