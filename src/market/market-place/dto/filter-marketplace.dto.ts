import { IsInt, IsString, IsOptional, Min } from 'class-validator';

export class FilterMarketplacesDto {
  @IsInt()
  blockchainId: number;

  @IsInt()
  priceMin: number;

  @IsInt()
  priceMax: number;

  @IsString()
  currency: string;

  @IsInt()
  typeId: number;

  @IsInt()
  days: number;

  @IsString()
  @IsOptional()
  searchQuery?: string;

  @IsInt()
  @IsOptional()
  @Min(1)
  page?: number = 1;

  @IsInt()
  @IsOptional()
  @Min(1)
  limit?: number = 10;

  @IsString()
  @IsOptional()
  sort?: string = 'id';

  @IsString()
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
