import { IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePointDto } from '@points/dto/create-point.dto';

export class CreateScheduleDto {
  @IsNumber()
  trainId: bigint;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePointDto)
  points: CreatePointDto[];
}
