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
import { UserRole } from '../entity/user.entity';

export class CreateUserByAdminDTO {
  @ApiProperty()
  @Matches(/^[آ-ی ]*$/, { message: 'نام خود را فارسی وارد کنید' })
  @IsString()
  @IsNotEmpty({ message: 'نام اجباری است' })
  firstName: string;

  @ApiProperty()
  @Matches(/^[آ-ی ]*$/, { message: 'نام خانوادگی خود را فارسی وارد کنید' })
  @IsString()
  @IsNotEmpty({ message: 'نام خانوادگی اجباری است' })
  lastName: string;
 
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

  @ApiProperty({ enum: UserRole})
  @IsEnum(UserRole,{message:''})
  roles: UserRole;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNumber({}, { message: 'لطفا شناسه آزمون را وارد کنید' })
  skuTest: number;

  @ApiProperty()
  @IsBoolean({ message: 'پارامتر پیامک را مشخص کنید' })
  isSms: boolean;

  @ApiProperty()
  @IsString({ message: 'لطفا رشته تحصیلی را وارد کنید' })
  field: string;

  @ApiProperty()
  @IsOptional()
  createdAt?: Date;
}
