import { IsDateString, IsNumber } from 'class-validator';

export class CreatePointDto {
  @IsNumber()
  placeId: number;

  @IsDateString()
  timeToArrive: Date;
}
