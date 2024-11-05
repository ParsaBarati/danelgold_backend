// update-slider.dto.ts
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateSliderDto {
  @IsOptional()
  @IsNumber()
  auctionId?: number;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsString()
  imagePath?: string;
}
