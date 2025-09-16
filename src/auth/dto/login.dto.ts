import { IsLogin } from '@common/validators/login.validator';
import { IsPassword } from '@common/validators/password.validator';

export class LoginDto {
  @IsLogin()
  login: string;

  @IsPassword()
  password: string;
}
