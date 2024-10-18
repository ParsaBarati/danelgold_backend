import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @ApiProperty()
  @Matches(/^09\d{9}$/, { message: 'Invalid phone format' })
  @IsString()
  @IsDefined({ message: 'Phone is required' })
  phone: string;

  @ApiProperty()
  @IsString()
  @IsDefined({ message: 'First name is required' })
  userName: string;

  @ApiProperty()
  @IsString()
  @IsDefined({ message: 'First name is required' })
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsDefined({ message: 'Last name is required' })
  lastName: string;

  @ApiProperty()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).*$/, {message: 'Password must contain both letters and numbers'})
  @MinLength(4, { message: 'Password must be at least 4 characters long' })
  @IsString()
  @IsDefined({ message: 'Password is required' })
  password: string;

  @ApiProperty()
  @IsString()
  @IsDefined({ message: 'Last name is required' })
  email: string;

  @ApiProperty()
  @IsOptional()
  createdAt?: Date;
}
