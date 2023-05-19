import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/user/auth/auth.service';

@Injectable()
export class WorkerService {
  constructor(private authService: AuthService) {}
  registerNewWorker(alias: string) {}
}
