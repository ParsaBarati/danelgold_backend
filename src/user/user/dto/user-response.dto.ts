import { ApiProperty } from '@nestjs/swagger';

class ItemDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;
}

class ArtistDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;
}

class ChainDto { // Define ChainDto
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;
}

class UserDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    profilePic: string;

    @ApiProperty()
    username: string;

    @ApiProperty({ type: [String] })
    socialMedias: string[];

    @ApiProperty()
    items: number;

    @ApiProperty()
    created: Date;

    @ApiProperty()
    earnings: number;

    @ApiProperty({ type: () => ChainDto }) // Use ChainDto here
    chain: ChainDto;

    @ApiProperty()
    cover: string;
}

class CollectionDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    floorPrice: number;

    @ApiProperty()
    currency: string;

    @ApiProperty()
    items: number;

    @ApiProperty()
    owners: number;
}

class HistoryDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    action: string;

    @ApiProperty({ type: () => ItemDto })
    item: ItemDto;

    @ApiProperty()
    price: number;

    @ApiProperty()
    currency: string;

    @ApiProperty()
    date: Date;
}

class CreatedArtDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    price: number;

    @ApiProperty()
    currency: string;

    @ApiProperty()
    dateCreated: Date;
}

class FavoriteDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty({ type: () => ArtistDto })
    artist: ArtistDto;

    @ApiProperty()
    price: number;

    @ApiProperty()
    currency: string;
}

export class UserResponseDto {
    @ApiProperty({ type: () => UserDto })
    user: UserDto;

    @ApiProperty({ type: () => ({ collections: [CollectionDto], history: [HistoryDto], created: [CreatedArtDto], favorites: [FavoriteDto] }) })
    data: {
        collections: CollectionDto[];
        history: HistoryDto[];
        created: CreatedArtDto[];
        favorites: FavoriteDto[];
    };

    @ApiProperty({ type: () => ({ currentPage: Number, totalPages: Number, pageSize: Number, totalItems: Number }) })
    pagination: {
        currentPage: number;
        totalPages: number;
        pageSize: number;
        totalItems: number;
    };
}
