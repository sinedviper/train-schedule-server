import { ApiProperty } from '@nestjs/swagger';
import { TrainType } from '@prisma/client';

export class TrainResponseDto {
  @ApiProperty({ description: 'Unique ID of the train', example: 1 })
  id: number;

  @ApiProperty({
    description: 'Name of the train',
    example: 'Intercity Express',
  })
  name: string;

  @ApiProperty({
    enum: TrainType,
    description: 'Type of the train',
    example: TrainType.HIGH_SPEED,
  })
  type: TrainType;

  @ApiProperty({
    description: 'Date when the train was created',
    example: '2025-09-16T12:00:00.000Z',
  })
  createdAt: Date;
}
