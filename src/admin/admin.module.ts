import { Module } from '@nestjs/common';
import { TasksModule } from 'src/tasks/tasks.module';
import { UserModule } from 'src/user/user.module';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

@Module({
  imports: [TasksModule, UserModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
