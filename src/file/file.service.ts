import { Injectable, Logger } from '@nestjs/common';
import * as oss from 'ali-oss';
import { User } from 'src/user/dto/user.entity';
@Injectable()
export class FileService {
  private ossClient: oss;
  constructor() {
    this.ossClient = new oss({
      region: 'oss-cn-hangzhou',
      // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
      accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID || '',
      accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET || '',
      bucket: 'asdkfj',
    });
    Logger.debug(
      `File Service started with ALIYUN_ACCESS_KEY_ID=${process.env.ALIYUN_ACCESS_KEY_ID}`,
    );
  }

  async uploadFile(user: User, file: Express.Multer.File) {
    const remoteName = `${user.id}_${Date.now()}_${file.originalname}`;
    const result = await this.ossClient.put(remoteName, file.buffer);
    Logger.debug(
      `file upload to Ali Oss with remoteName "${remoteName}" response with url="${result.url}"`,
    );
    return result;
  }
}
