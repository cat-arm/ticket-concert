import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { PrismaService } from '../prisma.service';
import { CancelReservationDto } from './dto/cancel-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.reservation.findMany({
      include: { concert: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Find reservations by session ID (for user history)
  findBySession(sessionId: string) {
    return this.prisma.reservation.findMany({
      where: { sessionId },
      include: { concert: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Reserve
  async reserve(createReservationDto: CreateReservationDto) {
    return this.prisma.$transaction(async (tx) => {
      // unique [sessionId, concertId] protect duplicate reservation
      const existingReservation = await tx.reservation.findUnique({
        where: {
          sessionId_concertId: {
            sessionId: createReservationDto.sessionId,
            concertId: createReservationDto.concertId,
          },
        },
      });
      if (existingReservation)
        throw new BadRequestException('Already reserved by this session');

      const concert = await tx.concert.findUnique({
        where: { id: createReservationDto.concertId },
      });
      if (!concert) throw new NotFoundException('Concert not found');

      // Check available seats
      const reservedCount = await tx.reservation.count({
        where: {
          concertId: createReservationDto.concertId,
          status: 'RESERVED',
        },
      });
      if (reservedCount >= concert.totalSeats) {
        throw new BadRequestException('No seat available');
      }

      // Create reservation
      const reservation = await tx.reservation.create({
        data: {
          sessionId: createReservationDto.sessionId,
          concertId: createReservationDto.concertId,
          status: 'RESERVED',
        },
      });

      return reservation;
    });
  }

  // cancel session+concert
  async cancel(cancelReservationDto: CancelReservationDto) {
    const current = await this.prisma.reservation.findUnique({
      where: {
        sessionId_concertId: {
          sessionId: cancelReservationDto.sessionId,
          concertId: cancelReservationDto.concertId,
        },
      },
    });
    if (!current) throw new NotFoundException('Reservation not found');

    if (current.status === 'CANCELLED') return current;

    return this.prisma.reservation.update({
      where: {
        sessionId_concertId: {
          sessionId: cancelReservationDto.sessionId,
          concertId: cancelReservationDto.concertId,
        },
      },
      data: { status: 'CANCELLED' },
    });
  }
}
