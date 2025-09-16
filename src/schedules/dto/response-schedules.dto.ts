import { ApiProperty } from '@nestjs/swagger';

export class SchedulePointDto {
  @ApiProperty({ description: 'Place ID', example: 1 })
  placeId: number;

  @ApiProperty({
    description: 'Time of arrival at the place',
    example: '2025-09-16T12:30:00Z',
  })
  timeToArrive: Date;
}

export class ResponseSchedulesDto {
  @ApiProperty({ description: 'Schedule ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Train ID', example: 1 })
  trainId: number;

  @ApiProperty({
    type: [SchedulePointDto],
    description: 'List of points in the schedule',
  })
  points: SchedulePointDto[];
}
