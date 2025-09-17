import { IsString, Matches, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PlacesPostDto {
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
}
