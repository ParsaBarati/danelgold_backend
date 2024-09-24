import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsDefined({ message: 'شماره همراه اجباری است' })
  @IsString()
  @Matches(/^09\d{9}$/, { message: 'Invalid phone format' })
  phone: string;

  @ApiProperty()
  @IsDefined({ message: 'رمز عبور اجباری است' })
  @IsString()
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  'arcaptcha-token': string;
}
