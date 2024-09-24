import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";

export class editDateUser {
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
  @IsOptional()
  phone: string;

  @ApiProperty()
  @IsString({ message: 'عکس را درست انتخاب کنید' })
  @IsOptional()
  imageUrl?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  email?: string;
}
