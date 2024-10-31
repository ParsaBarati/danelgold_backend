import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, Matches, IsNumber, IsNotEmpty, IsEnum } from 'class-validator';

export class UpdateUserDTO {
  @ApiProperty()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsString()
  bio?: string;


}
