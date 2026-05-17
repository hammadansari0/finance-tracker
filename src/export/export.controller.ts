import {
  Controller,
  Get,
  Req,
  Res,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExportService } from './export.service';

@UseGuards(JwtAuthGuard)
@Controller('export')
export class ExportController {
  constructor(private exportService: ExportService) {}

  // 📊 PDF REPORT (INCOME + EXPENSES)
  @Get('report')
  async exportReport(
    @Req() req,
    @Res() res,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const pdfBuffer = await this.exportService.generateReport(
      req.user.id,
      from,
      to,
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=report.pdf',
    });

    return res.send(pdfBuffer);
  }
}