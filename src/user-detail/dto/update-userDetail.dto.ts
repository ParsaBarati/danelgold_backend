import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDetailDTO {
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
