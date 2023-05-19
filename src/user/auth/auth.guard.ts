import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { IS_ADMIN_KEY, IS_PUBLIC_KEY, jwtConstants } from './constants';
import { Reflector } from '@nestjs/core';
import { AuthService } from './auth.service';
import { UserRole } from '../dto/user.entity';
import { AuthorizedRequest } from './interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthorizedRequest>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    const isAdmin = this.reflector.getAllAndOverride<boolean>(IS_ADMIN_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      // Logger.debug(`payload is ${JSON.stringify(payload)}`);
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      const user = await this.authService.getOneById({ id: payload.id });
      if (!user) {
        return false;
      }
      request['user_id'] = payload.id;
      request['user'] = user;
      if (isAdmin) {
        if (user?.role !== UserRole.ADMIN) return false;
      }
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
