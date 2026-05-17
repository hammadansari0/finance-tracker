import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  // 🔥 GET ALL EXPENSES (only for logged-in user)
  async getExpenses(userId: number) {
    return this.prisma.expense.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 🔥 GET SINGLE EXPENSE (secured)
  async getExpenseById(id: number, userId: number) {
    const expense = await this.prisma.expense.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!expense) {
      throw new NotFoundException(`Expense not found`);
    }

    return expense;
  }

  // 🔥 CREATE EXPENSE
  async addExpense(userId: number, dto: CreateExpenseDto) {
    return this.prisma.expense.create({
      data: {
        title: dto.title,
        amount: dto.amount,
        userId,
      },
    });
  }

  // 🔥 UPDATE FULL EXPENSE (PUT)
  async updateExpense(id: number, userId: number, dto: UpdateExpenseDto) {
    const expense = await this.prisma.expense.findFirst({
      where: { id, userId },
    });

    if (!expense) {
      throw new NotFoundException(`Expense not found`);
    }

    return this.prisma.expense.update({
      where: { id },
      data: {
        title: dto.title,
        amount: dto.amount,
      },
    });
  }

  // 🔥 PATCH EXPENSE (partial update)
  async patchExpense(id: number, userId: number, dto: UpdateExpenseDto) {
    const expense = await this.prisma.expense.findFirst({
      where: { id, userId },
    });

    if (!expense) {
      throw new NotFoundException(`Expense not found`);
    }

    return this.prisma.expense.update({
      where: { id },
      data: dto,
    });
  }

  // 🔥 DELETE EXPENSE (secured)
  async deleteExpense(id: number, userId: number) {
    const expense = await this.prisma.expense.findFirst({
      where: { id, userId },
    });

    if (!expense) {
      throw new NotFoundException(`Expense not found`);
    }

    await this.prisma.expense.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Expense deleted successfully',
    };
  }
}