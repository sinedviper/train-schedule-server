import { IsDateString, IsNumber } from 'class-validator';

export class CreatePointDto {
  @IsNumber()
  placeId: bigint;

  @IsDateString()
  timeToArrive: Date;
}
