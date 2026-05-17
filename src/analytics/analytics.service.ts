import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getSummary(userId: number) {
    // 💰 TOTAL INCOME
    const incomeData = await this.prisma.income.aggregate({
      where: { userId },
      _sum: {
        amount: true,
      },
      _count: true,
    });

    // 💸 TOTAL EXPENSES
    const expenseData = await this.prisma.expense.aggregate({
      where: { userId },
      _sum: {
        amount: true,
      },
      _count: true,
    });

    const totalIncome = incomeData._sum.amount || 0;
    const totalExpenses = expenseData._sum.amount || 0;

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      incomeTransactions: incomeData._count,
      expenseTransactions: expenseData._count,
    };
  }
}