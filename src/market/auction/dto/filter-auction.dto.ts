import { ApiProperty } from '@nestjs/swagger';

class ArtistDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;
}

class ItemDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty({ type: () => ArtistDto })
    artist: ArtistDto;

    @ApiProperty()
    startingBid?: number; // Optional for current auction items
}

export class CurrentAuctionDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    title: string;

    @ApiProperty()
    startDate: Date;

    @ApiProperty()
    endDate: Date;

    @ApiProperty({ type: () => ItemDto })
    items: ItemDto;
}

export class UpcomingAuctionDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    title: string;

    @ApiProperty()
    startDate: Date;

    @ApiProperty({ type: () => ItemDto })
    item: ItemDto; // Change from 'items' to 'item'
}

export class AuctionsResponseDto {
    @ApiProperty({ type: () => CurrentAuctionDto })
    currentAuction: CurrentAuctionDto;

    @ApiProperty({ type: () => [UpcomingAuctionDto] })
    upcomingAuctions: UpcomingAuctionDto[];
}
