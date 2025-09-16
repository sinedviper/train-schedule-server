import { IsDateString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePointDto {
  @ApiProperty({
    description: 'ID of the place for this schedule point',
    example: 1,
  })
  @IsNumber()
  placeId: number;

  @ApiProperty({
    description: 'Arrival time at this place (ISO 8601 format)',
    example: '2025-09-16T12:30:00Z',
  })
  @IsDateString()
  timeToArrive: Date;
}
