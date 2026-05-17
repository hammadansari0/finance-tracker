// import { Module } from '@nestjs/common';

// import { UsersService } from './users.service';

// @Module({
//   providers: [UsersService],

//   exports: [UsersService],
// })
// export class UsersModule {}





import { Module } from '@nestjs/common';

import { UsersService }
from './users.service';

import { PrismaModule }
from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],

  providers: [UsersService],

  exports: [UsersService],
})
export class UsersModule {}