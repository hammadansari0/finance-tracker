// import {
//   Injectable,
//   BadRequestException,
// } from '@nestjs/common';

// @Injectable()
// export class UsersService {

//   users: any[] = [];

//   create(user: any) {

//     const existingUser =
//       this.users.find(
//         u => u.email === user.email,
//       );

//     if (existingUser) {
//       throw new BadRequestException(
//         'Email already exists',
//       );
//     }

//     const newUser = {
//       id: this.users.length + 1,
//       ...user,
//     };

//     this.users.push(newUser);

//     return newUser;
//   }

//   findByEmail(email: string) {

//     return this.users.find(
//       user => user.email === email,
//     );
//   }

//   findById(id: number) {

//     return this.users.find(
//       user => user.id === id,
//     );
//   }
// }

import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService }
  from '../prisma/prisma.service';

@Injectable()
export class UsersService {

  constructor(
    private prisma: PrismaService,
  ) { }

  async create(user: any) {

    const existingUser =
      await this.prisma.user.findUnique({
        where: {
          email: user.email,
        },
      });

    if (existingUser) {

      throw new BadRequestException(
        'Email already exists',
      );
    }

    return this.prisma.user.create({
      data: user,
    });
  }

  async findByEmail(email: string) {

    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findById(id: number) {

    return this.prisma.user.findUnique({
      where: {
        id,
      },
      omit: {
        password: true,
      },
    });
  }
}