import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserByAdminDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'نام اجباری است' })
  username: string;
 
  @ApiProperty()
  @Matches(/^09\d{9}$/, { message: 'فرمت شماره همراه صحیح نیست' })
  @IsString()
  @IsNotEmpty({ message: 'فرمت شماره همراه صحیح نیست' })
  phone: string;

  @ApiProperty()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).*$/, {
    message: 'لطفا ترکیبی از حروف و اعداد وارد کنید',
  })
  @MinLength(4, { message: 'لطفا ترکیبی از حروف و اعداد وارد کنید' })
  @IsString()
  @IsNotEmpty({ message: 'لطفا ترکیبی از حروف و اعداد وارد کنید' })
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsBoolean({ message: 'پارامتر پیامک را مشخص کنید' })
  isSms: boolean;

  @ApiProperty()
  @IsOptional()
  createdAt?: Date;
}
