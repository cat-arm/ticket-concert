import { IsNotEmpty, IsString } from 'class-validator';
export class CancelReservationDto {
  @IsNotEmpty() @IsString() sessionId: string;
  @IsNotEmpty() @IsString() concertId: string;
}
