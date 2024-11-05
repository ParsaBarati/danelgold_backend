import { IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateSliderDto {
  @IsOptional()
  @IsNumber()
  auctionId?: number;

  @IsOptional()
  @IsString()
  link?: string;

  @IsString()
  imagePath: string;
}

export class SliderResponseDto {
  id: number;
  auctionId?: number;
  link?: string;
  imagePath: string;
}
