import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";
import { HasMimeType, IsFile } from 'nestjs-form-data';

export class MintNFTDto {
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  @IsNotEmpty()
  @IsFile()
  @HasMimeType(['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'])
  imageURL: Express.Multer.File;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  price: number;
}

export class MintNFTDataDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  price: number;
}
