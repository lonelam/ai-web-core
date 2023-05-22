import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { TaskTemplate } from 'src/tasks/dto/taskTemplate.entity';
import {
  ICreateTemplate,
  IUpdateTemplate,
} from 'src/tasks/dto/taskTemplate.interface';
import { TasksService } from 'src/tasks/tasks.service';
import { TemplateService } from 'src/tasks/template/template.service';
import { AuthService } from 'src/user/auth/auth.service';
import { Admin } from 'src/user/auth/constants';
import { User, UserRole } from 'src/user/dto/user.entity';

@Admin()
@Controller('admin')
export class AdminController {
  constructor(
    private authService: AuthService,
    private tasksService: TasksService,
    private templateService: TemplateService,
  ) {}
  @Get('users')
  async getAllUsers(): Promise<{ users: User[] }> {
    return this.authService.getAllUsers();
  }
  @Post('user/role')
  async changeUserRole(
    @Body() body: { userId: number; role: UserRole },
  ): Promise<User> {
    return this.authService.updateUserRole(body.userId, body.role);
  }
  @Get('tasks')
  async getAllTasks() {
    return this.tasksService.getAllTasks();
  }
  @Get('templates')
  async getAllTemplates() {
    return this.templateService.getAllTemplates();
  }
  @Get('template/:id')
  async getTemplateById(@Param('id') id: number) {
    const template = await this.templateService.getTemplateById(id);
    if (!template) {
      throw new NotFoundException();
    }
    return template;
  }
  @Put('template')
  async putTemplate(@Body() body: IUpdateTemplate) {
    return this.templateService.updateTemplate(body);
  }

  @ApiBody({ type: TaskTemplate })
  @Post('template/create')
  async createTemplate(@Body() body: ICreateTemplate) {
    return this.templateService.createTemplate(body);
  }

  @ApiBody({
    type: TaskTemplate,
  })
  @Post('template/update')
  async updateTemplate(@Body() body: IUpdateTemplate) {
    return this.templateService.updateTemplate(body);
  }

  @Delete('template/:id')
  async deleteTemplate(@Param('id') id: number) {
    return this.templateService.deleteTemplate(id);
  }
}
