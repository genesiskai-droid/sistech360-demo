// TECHNOVA 360 Backend - Reports Controller (DEMO/SANDBOX)
// ============================================================

import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Request as ExpressRequest } from 'express';

interface AuthUser {
  id: string;
  email: string;
  role: string;
}

@ApiTags('reports')
@Controller('reports')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @Roles('TECHNICIAN', 'ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Create technical report' })
  create(@Body() data: any, @Request() req: ExpressRequest & { user: AuthUser }) {
    return this.reportsService.create(data, req.user.id);
  }

  @Get('booking/:bookingId')
  @ApiOperation({ summary: 'Get reports for a booking' })
  findByBooking(@Param('bookingId') bookingId: string) {
    return this.reportsService.findByBooking(bookingId);
  }

  @Get()
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Get all reports' })
  findAll() {
    return this.reportsService.findAll();
  }
}
