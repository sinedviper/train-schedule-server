import {
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsEnum,
  ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PointPostDto } from '@schedules/dto/point-post.dto';
import { ApiProperty } from '@nestjs/swagger';
import { TrainType } from '@prisma/client';

export class SchedulesPostDto {
  @ApiProperty({
    description:
      'Type of the train. Must be one of the predefined train types.',
    enum: TrainType,
    example: TrainType.HIGH_SPEED,
  })
  @IsEnum(TrainType, { message: 'Type must be a valid TrainType' })
  type: TrainType;

  @ApiProperty({
    description: 'List of schedule points',
    type: [PointPostDto],
    minItems: 2,
    maxItems: 30,
  })
  @IsArray()
  @ArrayMinSize(2, { message: 'Schedule must have at least 2 points' })
  @ArrayMaxSize(30, { message: 'Schedule can have at most 30 points' })
  @ValidateNested({ each: true })
  @Type(() => PointPostDto)
  points: PointPostDto[];
}
