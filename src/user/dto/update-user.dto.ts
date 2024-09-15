import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, Matches, MinLength, IsNumber, IsNotEmpty, IsEnum } from 'class-validator';
import { UserRole } from '../entity/user.entity';

export class UpdateUserDTO {
  @ApiProperty()
  @Matches(/^[آ-ی ]*$/, { message: 'نام خود را فارسی وارد کنید' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty()
  @Matches(/^[آ-ی ]*$/, { message: 'نام خانوادگی خود را فارسی وارد کنید' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty()
  @Matches(/^09\d{9}$/, { message: 'فرمت شماره همراه صحیح نیست' })
  @IsString()
  @IsNotEmpty({ message: 'شماره همراه اجباری است' })
  phone: string;
  
  @ApiProperty()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).*$/, {
    message: 'لطفا ترکیبی از حروف و اعداد وارد کنید',
  })
  @MinLength(4, { message: 'لطفا ترکیبی از حروف و اعداد وارد کنید' })
  @IsString()
  @IsOptional()
  password?: string;
  
  @ApiProperty({enum:UserRole})
  @IsEnum(UserRole,{message:''})
  roles: UserRole;
  
  @ApiProperty()
  @IsString({message:'عکس را درست انتخاب کنید'})
  @IsOptional()
  imageUrl?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsNumber({}, { message: 'لطفا شناسه آزمون را به عدد وارد کنید' })
  @IsNotEmpty({message:'ساخت شناسه آزمون اجباری است'})
  skuTest?: number;

  @ApiProperty()
  @IsString({message:'پارامتر ارسالی صحیح نیست'})
  @IsOptional()
  field?: string;
}
