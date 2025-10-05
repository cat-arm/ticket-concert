import { IsNotEmpty, IsString } from 'class-validator';
export class CancelReservationDto {
  @IsNotEmpty() @IsString() concertId: string;
}
