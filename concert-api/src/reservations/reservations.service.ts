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
      orderBy: { id: 'desc' },
      include: { user: true, concert: true },
    });
  }

  // History of user
  findByUser(userId: string) {
    return this.prisma.reservation.findMany({
      where: { userId },
      orderBy: { id: 'desc' },
      include: { concert: true },
    });
  }

  // Reserve
  async reserve(createReservationDto: CreateReservationDto) {
    const { userId, concertId } = createReservationDto;

    return this.prisma.$transaction(async (tx) => {
      // unique [userId, concertId] protect duplicate reservation
      const existingReservation = await tx.reservation.findUnique({
        where: { userId_concertId: { userId, concertId } },
      });
      if (existingReservation)
        throw new BadRequestException('Already reserved by this user');

      const concert = await tx.concert.findUnique({ where: { id: concertId } });
      if (!concert) throw new NotFoundException('Concert not found');

      // Check available seats
      const reservedCount = await tx.reservation.count({
        where: { concertId, status: 'RESERVED' },
      });
      if (reservedCount >= concert.totalSeats) {
        throw new BadRequestException('No seat available');
      }

      // Create reservation
      const reservation = await tx.reservation.create({
        data: {
          userId,
          concertId,
          status: 'RESERVED',
        },
      });

      return reservation;
    });
  }

  // cancel user+concert
  async cancel(cancelReservationDto: CancelReservationDto) {
    const { userId, concertId } = cancelReservationDto;
    const current = await this.prisma.reservation.findUnique({
      where: { userId_concertId: { userId, concertId } },
    });
    if (!current) throw new NotFoundException('Reservation not found');

    if (current.status === 'CANCELLED') return current;

    return this.prisma.reservation.update({
      where: { userId_concertId: { userId, concertId } },
      data: { status: 'CANCELLED' },
    });
  }
}
