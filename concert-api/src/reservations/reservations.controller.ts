import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { CancelReservationDto } from './dto/cancel-reservation.dto';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  // Admin list
  @Get()
  findAll() {
    return this.reservationsService.findAll();
  }

  @Post()
  reserve(@Body() dto: CreateReservationDto) {
    return this.reservationsService.reserve(dto);
  }

  @Post('cancel')
  cancel(@Body() dto: CancelReservationDto) {
    return this.reservationsService.cancel(dto);
  }

  // User history - view own reservation history
  @Get('session/:sessionId')
  findBySession(@Param('sessionId') sessionId: string) {
    return this.reservationsService.findBySession(sessionId);
  }
}
