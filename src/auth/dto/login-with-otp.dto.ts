import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, Matches } from 'class-validator';

export class PhoneDto {
  @ApiProperty()
  @IsDefined({ message: 'فرمت شماره همراه صحیح نیست' })
  @IsString()
  @Matches(/^09\d{9}$/, { message: 'فرمت شماره همراه صحیح نیست' })
  phone: string;
}
