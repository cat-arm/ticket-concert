import { ReservationStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty() @IsString() sessionId: string;
  @IsNotEmpty() @IsString() concertId: string;
  @IsEnum(ReservationStatus) status?: ReservationStatus;
}
