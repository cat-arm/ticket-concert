import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma.service';
import { ReservationsService } from 'src/reservations/reservations.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, ReservationsService],
  exports: [UsersService],
})
export class UsersModule {}
