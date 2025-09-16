import { IsOptional } from 'class-validator';
import { IsName } from '@common/validators/name.validator';
import { IsLogin } from '@common/validators/login.validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsName()
  name?: string;

  @IsOptional()
  @IsLogin()
  login?: string;
}
