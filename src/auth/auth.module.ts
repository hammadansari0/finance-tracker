import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { UsersModule } from '../users/users.module';

import { jwtConstants } from './constants';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    UsersModule,

    JwtModule.register({
      secret: jwtConstants.secret,

      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],

  controllers: [AuthController],

  providers: [AuthService,JwtAuthGuard,],

  exports: [JwtAuthGuard, JwtModule],

})
export class AuthModule {}