import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsString()
  @Matches(/^09\d{9}$/, { message: 'Invalid phone format' })
  @IsOptional()
  phone?: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsDefined({ message: 'رمز عبور اجباری است' })
  @IsString()
  password: string;

}
