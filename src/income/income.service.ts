import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';

@Injectable()
export class IncomeService {
  constructor(private prisma: PrismaService) {}

  // ➕ CREATE INCOME
  async addIncome(userId: number, dto: CreateIncomeDto) {
    return this.prisma.income.create({
      data: {
        title: dto.title,
        amount: dto.amount,
        userId,
      },
    });
  }

  // 📥 GET ALL INCOME (user-specific)
  async getIncome(userId: number) {
    return this.prisma.income.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 🔍 GET BY ID
  async getIncomeById(id: number, userId: number) {
    const income = await this.prisma.income.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!income) {
      throw new NotFoundException('Income not found');
    }

    return income;
  }

  // ✏️ FULL UPDATE (PUT)
  async updateIncome(id: number, userId: number, dto: UpdateIncomeDto) {
    const income = await this.prisma.income.findFirst({
      where: { id, userId },
    });

    if (!income) {
      throw new NotFoundException('Income not found');
    }

    return this.prisma.income.update({
      where: { id },
      data: {
        title: dto.title,
        amount: dto.amount,
      },
    });
  }

  // 🧩 PARTIAL UPDATE (PATCH)
  async patchIncome(id: number, userId: number, dto: UpdateIncomeDto) {
    const income = await this.prisma.income.findFirst({
      where: { id, userId },
    });

    if (!income) {
      throw new NotFoundException('Income not found');
    }

    return this.prisma.income.update({
      where: { id },
      data: dto,
    });
  }

  // ❌ DELETE
  async deleteIncome(id: number, userId: number) {
    const income = await this.prisma.income.findFirst({
      where: { id, userId },
    });

    if (!income) {
      throw new NotFoundException('Income not found');
    }

    await this.prisma.income.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Income deleted successfully',
    };
  }
}