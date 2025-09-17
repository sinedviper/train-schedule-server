import { IsNotEmpty, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FavoritesPostDto {
  @ApiProperty({
    description: 'ID of the schedule to add to favorites',
    example: 1,
  })
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  scheduleId: number;
}
