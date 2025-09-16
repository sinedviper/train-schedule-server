import { IsEnum } from 'class-validator';
import { IsName } from '@common/validators/name.validator';
import { IsLogin } from '@common/validators/login.validator';
import { IsPassword } from '@common/validators/password.validator';
import { Role } from '@prisma/client';

export class RegisterDto {
  @IsName()
  name: string;

  @IsLogin()
  login: string;

  @IsPassword()
  password: string;

  @IsEnum(Role)
  role: Role;
}
