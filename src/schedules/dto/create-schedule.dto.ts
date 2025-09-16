import {
  IsArray,
  ValidateNested,
  IsNumber,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePointDto } from '@schedules/dto/create-point.dto';

export class CreateScheduleDto {
  @IsNumber()
  trainId: number;

  @IsArray()
  @ArrayMinSize(2, { message: 'Schedule must have at least 2 points' })
  @ValidateNested({ each: true })
  @Type(() => CreatePointDto)
  points: CreatePointDto[];
}
