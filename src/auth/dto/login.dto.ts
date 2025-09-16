import { IsLogin } from '@common/validators/login.validator';
import { IsPassword } from '@common/validators/password.validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description:
      'User login. Can contain letters (upper and lower case), numbers, "-" and ".". Length 3-15 characters.',
    example: 'john.doe123',
  })
  @IsLogin()
  login: string;

  @ApiProperty({
    description:
      'User password. Must be 6-20 characters, include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.',
    example: 'StrongP@ssw0rd!',
  })
  @IsPassword()
  password: string;
}
