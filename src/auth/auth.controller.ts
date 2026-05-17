import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('register')
  register(
    @Body() body: RegisterDto,
  ) {

    return this.authService.register(body);
  }

  @Post('login')
  login(
    @Body() body: LoginDto,
  ) {

    return this.authService.login(body);
  }

@UseGuards(JwtAuthGuard)
@Get('me')
async getMe(
  @Req() req,
) {

  const userId = req.user.id;

  const user =
    await this.usersService.findById(
      userId,
    );

  return {
    success: true,
    data: user,
  };
}
}