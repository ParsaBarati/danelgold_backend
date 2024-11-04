import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class FilterUsersDto {
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

    @IsOptional()
    @IsString()
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
