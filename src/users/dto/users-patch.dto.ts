import { IsOptional } from 'class-validator';
import { IsName } from '@common/validators/name.validator';
import { IsLogin } from '@common/validators/login.validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UsersPatchDto {
  @ApiPropertyOptional({
    description:
      'User name (Latin letters only, with optional spaces, 1-50 characters)',
    example: 'John Doe',
  })
  @IsOptional()
  @IsName()
  name?: string;

  @ApiPropertyOptional({
    description: 'User login (letters, numbers, dash, dot, 3-15 characters)',
    example: 'johndoe123',
  })
  @IsOptional()
  @IsLogin()
  login?: string;
}
