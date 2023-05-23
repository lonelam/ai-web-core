import {
  Controller,
  Get,
  Request,
  Post,
  Body,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { Public } from './auth/constants';
import { UserRegisterParams } from './dto/register.validation';
import { User } from './dto/user.entity';
import { IPublicUser } from './dto/user.interface';

@Controller('user')
export class UserController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Get('profile')
  async getProfile(@Request() req: { user_id: number }): Promise<IPublicUser> {
    const user = await this.authService.getOneById({ id: req.user_id });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user.getPublicData();
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(
    @Body() body: UserRegisterParams,
  ): Promise<IPublicUser & { accessToken: string }> {
    const user = await this.authService.register(body);
    const { accessToken } = await this.authService.getLoginAccessToken(user);
    return {
      ...user.getPublicData(),
      accessToken,
    };
  }
}
