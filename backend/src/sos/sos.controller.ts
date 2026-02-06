// TECHNOVA 360 Backend - SOS Controller (DEMO/SANDBOX)
// ============================================================

import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SosService } from './sos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Request as ExpressRequest } from 'express';

interface AuthUser {
  id: string;
  email: string;
  role: string;
}

@ApiTags('sos')
@Controller('sos')
export class SosController {
  constructor(private sosService: SosService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create SOS request' })
  create(@Body() data: any, @Request() req: ExpressRequest & { user: AuthUser }) {
    return this.sosService.create(data, req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Roles('ADMIN', 'MANAGER', 'TECHNICIAN')
  @ApiOperation({ summary: 'Get all SOS requests' })
  findAll(@Query('status') status?: string, @Query('priority') priority?: string) {
    return this.sosService.findAll({ status, priority });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Roles('ADMIN', 'MANAGER', 'TECHNICIAN')
  @ApiOperation({ summary: 'Update SOS status' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('assignedTo') assignedTo?: string,
  ) {
    return this.sosService.updateStatus(id, status, assignedTo);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Get SOS statistics' })
  getStats() {
    return this.sosService.getStats();
  }
}
