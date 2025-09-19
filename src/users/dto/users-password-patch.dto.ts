import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({ description: 'Current password', example: 'oldPassword123' })
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({ description: 'New password', example: 'newPassword456' })
  @IsNotEmpty()
  @MinLength(6, { message: 'New password must be at least 6 characters' })
  newPassword: string;
}
