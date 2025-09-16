import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsName } from '@common/validators/name.validator';
import { IsLogin } from '@common/validators/login.validator';
import { IsPassword } from '@common/validators/password.validator';
import { Role } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({
    description: 'User full name. Only Latin letters, 1-50 characters.',
    example: 'John Doe',
  })
  @IsName()
  name: string;

  @ApiProperty({
    description:
      'Login username. Can contain letters (upper and lower case), numbers, "-" and ".", length 3-15 characters.',
    example: 'john.doe123',
  })
  @IsLogin()
  login: string;

  @ApiProperty({
    description:
      'Password. Must be 6-20 characters, include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.',
    example: 'StrongP@ssw0rd!',
  })
  @IsPassword()
  password: string;

  @ApiProperty({
    description: 'Role of the user. Can be USER or ADMIN.',
    enum: Role,
    example: Role.USER,
  })
  @IsEnum(Role)
  role: Role;
}
