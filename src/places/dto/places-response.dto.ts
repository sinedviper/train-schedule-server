import {
  IsString,
  Matches,
  MaxLength,
  IsNumber,
  IsDate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PlacesResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the place',
    example: 1,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description:
      'Name of the place (Latin letters, numbers, spaces, (), ., ,, - allowed, max 50 characters)',
    example: 'Kyiv-Central Station (Platform 5)',
  })
  @IsString()
  @MaxLength(50, { message: 'Name can be at most 50 characters long' })
  @Matches(/^[A-Za-z0-9\s().,-]+$/, {
    message:
      'Name can contain only Latin letters, numbers, spaces, (), ., ,, -',
  })
  name: string;

  @ApiProperty({
    description: 'Date and time when the place was created',
    example: '2025-09-16T14:00:00Z',
  })
  @IsDate()
  createdAt: Date;
}
