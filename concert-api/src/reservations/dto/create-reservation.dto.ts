import { ReservationStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty() @IsString() userId: string;
  @IsNotEmpty() @IsString() concertId: string;
  @IsNotEmpty() @IsEnum(ReservationStatus) status?: ReservationStatus;
}
