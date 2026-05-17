// import { Module } from '@nestjs/common';
// // import { AppController } from './app.controller';
// // import { AppService } from './app.service';
// import { ExpensesModule } from './expenses/expenses.module';
// // import { ExpensesController } from './expenses/expenses.controller';
// // import { ExpensesService } from './expenses/expenses.service';
// import { AuthModule } from './auth/auth.module';
// import { UsersModule } from './users/users.module';

// @Module({
//   imports: [ExpensesModule, AuthModule, UsersModule],
// })
// export class AppModule {}

import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { IncomeModule } from './income/income.module';
import { AnalyticsModule } from './analytics/analytics.module';

import { ExpensesModule }
from './expenses/expenses.module';

import { AuthModule }
from './auth/auth.module';

import { UsersModule }
from './users/users.module';

@Module({
  imports: [
    ExpensesModule,
    AuthModule,
    UsersModule,
    PrismaModule,
    IncomeModule,
    AnalyticsModule,
  ],
})
export class AppModule {}