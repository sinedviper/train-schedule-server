import { IsString, IsEnum, MaxLength, Matches } from 'class-validator';
import { TrainType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTrainDto {
  @ApiProperty({
    description:
      'Name of the train (Latin letters, numbers, spaces, parentheses (), dash - allowed, max 50 characters)',
    example: 'ECP Express',
  })
  @IsString()
  @MaxLength(50, { message: 'Name can be at most 50 characters long' })
  @Matches(/^[A-Za-z0-9\s()-]+$/, {
    message:
      'Name can contain only Latin letters, numbers, spaces, parentheses (), dash -',
  })
  name: string;

  @ApiProperty({
    description:
      'Type of the train. Must be one of the predefined train types.',
    enum: TrainType,
    example: TrainType.HIGH_SPEED,
  })
  @IsEnum(TrainType, { message: 'Type must be a valid TrainType' })
  type: TrainType;
}
