import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, Matches, MinLength, IsNumber, IsNotEmpty, IsEnum } from 'class-validator';
import { UserRole } from '../entity/user.entity';

export class UpdateUserDTO {
  @ApiProperty()
  @IsString()
  @IsOptional()
  username?: string;

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
  
  @ApiProperty()
  @IsString({message:'عکس را درست انتخاب کنید'})
  @IsOptional()
  profilePic?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  email?: string;
}
