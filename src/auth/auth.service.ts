import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { UsersService } from '../users/users.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(body: RegisterDto) {

    const hashedPassword =
      await bcrypt.hash(body.password, 10);

    const user =
      this.usersService.create({
        ...body,
        password: hashedPassword,
      });

    return {
      success: true,
      data: user,
    };
  }

  async login(body: LoginDto) {

    const user =
      await this.usersService.findByEmail(
        body.email,
      );

    if (!user) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    const isPasswordMatched =
      await bcrypt.compare(
        body.password,
        user.password,
      );

    if (!isPasswordMatched) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const access_token =
      await this.jwtService.signAsync(
        payload,
      );

    return {
      success: true,
      access_token,
    };
  }
}