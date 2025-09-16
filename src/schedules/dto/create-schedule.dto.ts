import {
  IsArray,
  ValidateNested,
  IsNumber,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePointDto } from '@schedules/dto/create-point.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateScheduleDto {
  @ApiProperty({
    description: 'ID of the train for which the schedule is created',
    example: 1,
  })
  @IsNumber()
  trainId: number;

  @ApiProperty({
    description: 'List of schedule points',
    type: [CreatePointDto],
    minItems: 2,
  })
  @IsArray()
  @ArrayMinSize(2, { message: 'Schedule must have at least 2 points' })
  @ValidateNested({ each: true })
  @Type(() => CreatePointDto)
  points: CreatePointDto[];
}
