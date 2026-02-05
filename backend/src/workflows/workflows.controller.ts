// TECHNOVA 360 Backend - Workflows Controller (DEMO/SANDBOX)
// ============================================================

import { Controller, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WorkflowsService } from './workflows.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('workflows')
@Controller('workflows')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WorkflowsController {
  constructor(private workflowsService: WorkflowsService) {}

  @Get('booking/:bookingId')
  @ApiOperation({ summary: 'Get workflow steps for a booking' })
  findByBooking(@Param('bookingId') bookingId: string) {
    return this.workflowsService.findByBooking(bookingId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update workflow step status' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('technicianId') technicianId?: string,
  ) {
    return this.workflowsService.updateStatus(id, status, technicianId);
  }
}
