import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateConcertDto } from './dto/create-concert.dto';
// import { UpdateConcertDto } from './dto/update-concert.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ConcertsService {
  constructor(private prisma: PrismaService) {}

  create(createConcertDto: CreateConcertDto) {
    return this.prisma.concert.create({ data: createConcertDto });
  }

  findAll() {
    return this.prisma.concert.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async remove(id: string) {
    const exists = await this.prisma.concert.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Concert not found');

    // Use transaction to ensure data consistency
    await this.prisma.$transaction(async (tx) => {
      // Delete all related reservations first
      await tx.reservation.deleteMany({ where: { concertId: id } });

      // Then delete the concert
      await tx.concert.delete({ where: { id } });
    });

    return { ok: true };
  }

  async stats() {
    const [agg, reserved, cancelled] = await this.prisma.$transaction([
      this.prisma.concert.aggregate({ _sum: { totalSeats: true } }),
      this.prisma.reservation.count({ where: { status: 'RESERVED' } }),
      this.prisma.reservation.count({ where: { status: 'CANCELLED' } }),
    ]);
    return {
      totalSeats: agg._sum.totalSeats ?? 0,
      reserve: reserved,
      cancel: cancelled,
    };
  }
}
