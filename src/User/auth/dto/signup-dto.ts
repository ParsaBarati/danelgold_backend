import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @ApiProperty()
  @Matches(/^09\d{9}$/, { message: 'Invalid phone format' })
  @IsString()
  @IsOptional
  ()
  phone?: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsString()
  @IsDefined({ message: 'First name is required' })
  userName: string;

  @ApiProperty()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).*$/, {message: 'Password must contain both letters and numbers'})
  @MinLength(4, { message: 'Password must be at least 4 characters long' })
  @IsString()
  @IsDefined({ message: 'Password is required' })
  password: string;

  @ApiProperty()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).*$/, {message: 'Password must contain both letters and numbers'})
  @MinLength(4, { message: 'Password must be at least 4 characters long' })
  @IsString()
  @IsDefined({ message: 'Password is required' })
  confirmPassword: string;

  @ApiProperty()
  @IsOptional()
  createdAt?: Date;
}
