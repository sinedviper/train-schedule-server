import { IsString, IsEnum } from 'class-validator';
import { TrainType } from '@prisma/client';

export class CreateTrainDto {
  @IsString()
  name: string;

  @IsEnum(TrainType)
  type: TrainType;
}
