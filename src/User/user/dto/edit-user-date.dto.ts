import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";

export class editDateUser {
  @ApiProperty()
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty()
  @Matches(/^09\d{9}$/, { message: 'فرمت شماره همراه صحیح نیست' })
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty()
  @IsString({ message: 'عکس را درست انتخاب کنید' })
  @IsOptional()
  profilePic?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  email?: string;
}
