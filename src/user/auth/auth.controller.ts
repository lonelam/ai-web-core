import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginParams } from '../dto/login.validation';
import { AuthService } from './auth.service';
import { Public } from './constants';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  logIn(@Body() logInDto: LoginParams) {
    return this.authService.logIn(logInDto);
  }
}
