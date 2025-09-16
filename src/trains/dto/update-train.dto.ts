import { PartialType } from '@nestjs/mapped-types';
import { CreateTrainDto } from './create-train.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TrainType } from '@prisma/client';

export class UpdateTrainDto extends PartialType(CreateTrainDto) {
  @ApiPropertyOptional({ description: 'Updated name of the train' })
  name?: string;

  @ApiPropertyOptional({ description: 'Updated type of the train' })
  type?: TrainType;
}
