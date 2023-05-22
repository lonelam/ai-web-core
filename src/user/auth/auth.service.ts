import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../dto/user.entity';
import { IRegisterUser } from '../dto/user.interface';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Authority } from '../dto/authority.entity';
import * as emailValidator from 'email-validator';
import { LoginParams } from '../dto/login.validation';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Authority)
    private authorityRepository: Repository<Authority>,
    private jwtService: JwtService,
  ) {
    this.userRepository.count().then(async (count) => {
      Logger.debug(`currently ${count} users are registerd in the service`);
      if (!count) {
        Logger.log(`no users in the system, creating the superuser`);
        const user = new User();
        user.email = `z@laizn.com`;
        user.userName = `laizn`;
        user.firstName = 'Lai';
        user.lastName = 'Zenan';
        user.secretAuthPasswd = await this.getSecretAuthByPassword(
          process.env.SUPER_USER_INIT_PASSWORD || 'laizn',
        );
        this.userRepository.save(user);
      }
    });
  }

  private async getSecretAuthByPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  private async checkSecretAuthByPassword(
    password: string,
    secretAuth: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, secretAuth);
  }

  async updateUserRole(id: number, role: UserRole) {
    const user = await this.getOneById({ id });
    if (!user) {
      throw new BadRequestException(`the user id [${id}] is invalid`);
    }
    user.role = role;
    this.userRepository.save(user);
    return user;
  }

  async getAllUsers() {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.isActive = true')
      .limit(1000)
      .getMany();
    return { users };
  }

  async register({
    email,
    userName,
    password,
    firstName,
    lastName,
    phone,
  }: IRegisterUser): Promise<User> {
    if (!email) {
      throw new BadRequestException('the email should not be empty');
    }
    if (!emailValidator.validate(email)) {
      throw new BadRequestException('the email is not a valid email');
    }

    if (!userName) {
      throw new BadRequestException('the userName should not be empty');
    }

    const existUserByEmail = await this.getOneByEmail({ email });
    if (existUserByEmail) {
      throw new BadRequestException('the email is already registered');
    }

    const existUserByUserName = await this.getOneByUserName({ userName });
    if (existUserByUserName) {
      throw new BadRequestException('the userName is already used');
    }

    const user = new User();
    user.email = email;
    user.secretAuthPasswd = await this.getSecretAuthByPassword(password);
    user.userName = userName;
    user.firstName = firstName;
    user.lastName = lastName;
    user.role = UserRole.NORMAL;
    if (phone) {
      user.phone = phone;
    }

    const savedUser = await this.userRepository.save(user);
    // default features
    const authForStableDiffusion = new Authority();
    authForStableDiffusion.featureKey = 'sd';
    authForStableDiffusion.owner = user;
    this.authorityRepository.save(authForStableDiffusion);
    return savedUser;
  }
  async getOneById({ id }: { id: number }) {
    return this.userRepository.findOneBy({
      id,
    });
  }
  async getOneByUserName({ userName }: { userName: string }) {
    return this.userRepository.findOneBy({
      userName,
    });
  }

  async getOneByPhoneNumber({ phone }: { phone: string }) {
    return this.userRepository.findOneBy({
      phone,
    });
  }

  async getOneByEmail({ email }: { email: string }) {
    return this.userRepository.findOneBy({
      email,
    });
  }

  async getLoginAccessToken(user: User): Promise<{ accessToken: string }> {
    const payload = {
      username: user.userName,
      email: user.email,
      id: user.id,
    };

    // Logger.debug(`payload is ${JSON.stringify(payload)}`);
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async logIn(logInDto: LoginParams) {
    let user: User | null;
    const { email, userName, password, phone } = logInDto;
    if (email) {
      user = await this.getOneByEmail({ email });
    } else if (userName) {
      user = await this.getOneByUserName({ userName });
    } else if (phone) {
      user = await this.getOneByPhoneNumber({ phone });
    } else {
      throw new BadRequestException(
        'params should have either email or userName',
      );
    }
    if (!user) {
      throw new UnauthorizedException();
    }
    // Logger.debug(`user founded: ${JSON.stringify(user)}`);
    const passwordVerified = await this.checkSecretAuthByPassword(
      password,
      user.secretAuthPasswd,
    );
    if (!passwordVerified) {
      throw new UnauthorizedException();
    }
    // logged in.
    return this.getLoginAccessToken(user);
  }
}
