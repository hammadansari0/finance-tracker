import {
  UseGuards,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Put,
  Patch,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';

import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpensesService } from './expenses.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('expenses')
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  // 🔥 GET ALL (user-specific)
  @Get()
  getExpenses(@Req() req) {
    return this.expensesService.getExpenses(req.user.id);
  }

  // 🔥 GET ONE (user-specific)
  @Get(':id')
  getExpenseById(@Param('id') id: string, @Req() req) {
    return this.expensesService.getExpenseById(
      Number(id),
      req.user.id,
    );
  }

  // 🔥 CREATE EXPENSE
  @Post()
  @HttpCode(HttpStatus.CREATED)
  addExpense(@Req() req, @Body() body: CreateExpenseDto) {
    console.log('USER:', req.user);
    return this.expensesService.addExpense(req.user.id, body);
  }

  // 🔥 FULL UPDATE (PUT)
  @Put(':id')
  updateExpense(
    @Param('id') id: string,
    @Req() req,
    @Body() body: UpdateExpenseDto,
  ) {
    return this.expensesService.updateExpense(
      Number(id),
      req.user.id,
      body,
    );
  }

  // 🔥 PARTIAL UPDATE (PATCH)
  @Patch(':id')
  patchExpense(
    @Param('id') id: string,
    @Req() req,
    @Body() body: UpdateExpenseDto,
  ) {
    return this.expensesService.patchExpense(
      Number(id),
      req.user.id,
      body,
    );
  }

  // 🔥 DELETE
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  deleteExpense(@Param('id') id: string, @Req() req) {
    return this.expensesService.deleteExpense(
      Number(id),
      req.user.id,
    );
  }
}