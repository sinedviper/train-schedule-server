import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UsersResponseDto {
  @ApiProperty({ description: 'User ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'User name', example: 'John Doe' })
  name: string;

  @ApiProperty({ description: 'User login', example: 'johndoe123' })
  login: string;

  @ApiProperty({ description: 'User role', enum: Role, example: Role.USER })
  role: Role;
}
