import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, Matches } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty()
  @Matches(/^09\d{9}$/, { message: 'Invalid phone format' })
  @IsString()
  @IsDefined()
  phone: string;

  @ApiProperty()
  @IsString()
  @IsDefined({ message: 'OTP is required' })
  otp: string;
}
