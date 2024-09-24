import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateUserDetailDTO {
  @IsString()
  @IsOptional()
  ip?: string;

  @IsString()
  @IsOptional()
  platform?: string;

  @IsString()
  @IsOptional()
  browser?: string;

  @IsString()
  @IsOptional()
  versionBrowser?: string;

  @IsString()
  @IsOptional()
  versionPlatform?: string;
}
