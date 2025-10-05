import { IsNotEmpty, IsString } from 'class-validator';
export class CancelReservationDto {
  @IsNotEmpty() @IsString() userId: string;
  @IsNotEmpty() @IsString() concertId: string;
}
