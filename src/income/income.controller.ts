import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { IncomeService } from './income.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';

@UseGuards(JwtAuthGuard)
@Controller('income')
export class IncomeController {
  constructor(private incomeService: IncomeService) {}

  // ➕ CREATE
  @Post()
  @HttpCode(HttpStatus.CREATED)
  addIncome(@Req() req, @Body() body: CreateIncomeDto) {
    return this.incomeService.addIncome(req.user.id, body);
  }

  // 📥 GET ALL
  @Get()
  getIncome(@Req() req) {
    return this.incomeService.getIncome(req.user.id);
  }

  // 🔍 GET ONE
  @Get(':id')
  getIncomeById(@Param('id') id: string, @Req() req) {
    return this.incomeService.getIncomeById(Number(id), req.user.id);
  }

  // ✏️ PUT
  @Put(':id')
  updateIncome(
    @Param('id') id: string,
    @Req() req,
    @Body() body: UpdateIncomeDto,
  ) {
    return this.incomeService.updateIncome(Number(id), req.user.id, body);
  }

  // 🧩 PATCH
  @Patch(':id')
  patchIncome(
    @Param('id') id: string,
    @Req() req,
    @Body() body: UpdateIncomeDto,
  ) {
    return this.incomeService.patchIncome(Number(id), req.user.id, body);
  }

  // ❌ DELETE
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  deleteIncome(@Param('id') id: string, @Req() req) {
    return this.incomeService.deleteIncome(Number(id), req.user.id);
  }
}