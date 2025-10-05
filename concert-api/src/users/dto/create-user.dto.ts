import { IsNotEmpty, IsString } from 'class-validator';

// still not concern about password just user for test
export class CreateUserDto {
  @IsNotEmpty() @IsString() email: string;
  @IsNotEmpty() @IsString() name: string;
}
