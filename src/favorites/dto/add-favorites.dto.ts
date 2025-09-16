import { IsNotEmpty, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class AddFavoritesDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  scheduleId: number;
}
