import { ApiProperty } from '@nestjs/swagger';
import { TrainType } from '@prisma/client';
import { PlacesResponseDto } from '@places/dto/places-response.dto';

export class SchedulePointDto {
  @ApiProperty({ description: 'Place ID', example: 1 })
  placeId: number;

  @ApiProperty({ description: 'Place', example: { id: 1, name: 'Kyiv' } })
  place: PlacesResponseDto;

  @ApiProperty({
    description: 'Time of arrival at the place',
    example: '2025-09-16T12:30:00Z',
  })
  timeToArrive: Date;
}

export class SchedulesResponseDto {
  @ApiProperty({ description: 'Schedule ID', example: 1 })
  id: number;

  @ApiProperty({
    enum: TrainType,
    description: 'Type of the train',
    example: TrainType.HIGH_SPEED,
  })
  type: TrainType;

  @ApiProperty({
    type: [SchedulePointDto],
    description: 'List of points in the schedule',
  })
  points: SchedulePointDto[];
}
