import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsOptional, Min } from 'class-validator';

export class CollectionResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    icon: string;

    @ApiProperty()
    floorPrice: number;

    @ApiProperty()
    floorChange: number;

    @ApiProperty()
    volume: number;

    @ApiProperty()
    volumeChange: number;

    @ApiProperty()
    items: string;

    @ApiProperty()
    owners: number;

    @ApiProperty()
    currency: string;
}

export class WatchlistResponseDto {
    @ApiProperty({ type: () => [CollectionResponseDto] })
    collections: CollectionResponseDto[];

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
