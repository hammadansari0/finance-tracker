import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import PDFDocument from 'pdfkit';

@Injectable()
export class ExportService {
  constructor(private prisma: PrismaService) {}

  // 🔥 GET DATA WITH DATE FILTER
  private getDateFilter(from?: string, to?: string) {
    const filter: any = {};

    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.gte = new Date(from);
      if (to) filter.createdAt.lte = new Date(to);
    }

    return filter;
  }

  // 📊 MAIN REPORT (INCOME + EXPENSES)
  async generateReport(userId: number, from?: string, to?: string) {
    const dateFilter = this.getDateFilter(from, to);

    // 💰 INCOME
    const income = await this.prisma.income.findMany({
      where: {
        userId,
        ...dateFilter,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // 💸 EXPENSES
    const expenses = await this.prisma.expense.findMany({
      where: {
        userId,
        ...dateFilter,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return this.createPDF(income, expenses);
  }

  // 📄 CREATE PDF FILE
  private createPDF(income: any[], expenses: any[]) {
    const doc = new PDFDocument();

    let buffers: any[] = [];

    doc.on('data', buffers.push.bind(buffers));

    return new Promise((resolve) => {
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // 🧾 HEADER
      doc.fontSize(18).text('FINANCIAL REPORT', { align: 'center' });
      doc.moveDown();

      // 💰 INCOME SECTION
      doc.fontSize(14).text('INCOME');
      doc.moveDown(0.5);

      let totalIncome = 0;

      income.forEach((item) => {
        totalIncome += item.amount;
        doc
          .fontSize(12)
          .text(
            `${item.title} - $${item.amount} (${item.createdAt.toDateString()})`,
          );
      });

      doc.moveDown();

      // 💸 EXPENSE SECTION
      doc.fontSize(14).text('EXPENSES');
      doc.moveDown(0.5);

      let totalExpenses = 0;

      expenses.forEach((item) => {
        totalExpenses += item.amount;
        doc
          .fontSize(12)
          .text(
            `${item.title} - $${item.amount} (${item.createdAt.toDateString()})`,
          );
      });

      doc.moveDown();

      // 📊 SUMMARY
      doc.fontSize(14).text('SUMMARY');
      doc.moveDown(0.5);

      const balance = totalIncome - totalExpenses;

      doc
        .fontSize(12)
        .text(`Total Income: $${totalIncome}`)
        .text(`Total Expenses: $${totalExpenses}`)
        .text(`Balance: $${balance}`);

      doc.end();
    });
  }
}