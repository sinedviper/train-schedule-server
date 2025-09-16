import { ApiProperty } from '@nestjs/swagger';

export class ResponseFavoritesDto {
  @ApiProperty({ description: 'ID of the favorite record', example: 1 })
  id: number;

  @ApiProperty({ description: 'ID of the schedule', example: 101 })
  scheduleId: number;

  @ApiProperty({ description: 'ID of the user', example: 1 })
  userId: number;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2025-09-16T12:00:00.000Z',
  })
  createdAt: Date;
}
