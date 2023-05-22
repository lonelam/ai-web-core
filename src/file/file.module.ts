import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [UserModule],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
