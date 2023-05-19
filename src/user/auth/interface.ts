import { Request } from 'express';
import { User } from '../dto/user.entity';

export interface AuthorizedRequest extends Request {
  user_id: number;
  user: User;
}
