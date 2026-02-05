// TECHNOVA 360 Backend - Bookings Controller (DEMO/SANDBOX)
// ============================================================

import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  create(@Body() createBookingDto: CreateBookingDto, @Request() req) {
    return this.bookingsService.create(createBookingDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bookings' })
  @Roles('ADMIN', 'MANAGER')
  findAll(@Query('status') status?: string, @Query('technicianId') technicianId?: string) {
    return this.bookingsService.findAll({ status, technicianId });
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get booking statistics' })
  @Roles('ADMIN', 'MANAGER')
  getStats() {
    return this.bookingsService.getBookingStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by ID' })
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update booking' })
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @Patch(':id/assign')
  @ApiOperation({ summary: 'Assign technician to booking' })
  @Roles('ADMIN', 'MANAGER')
  assignTechnician(@Param('id') id: string, @Body('technicianId') technicianId: string) {
    return this.bookingsService.assignTechnician(id, technicianId);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel booking' })
  cancel(@Param('id') id: string) {
    return this.bookingsService.cancel(id);
  }
}
