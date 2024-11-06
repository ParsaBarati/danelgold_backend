import {Controller, Get, Param, ParseIntPipe, Post, Req} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import {FavoritesService} from "./favorites.service";

@ApiBearerAuth()
@ApiTags('Favorites')
@Controller('favorites')
export class FavoritesController {
    constructor(private readonly favoritesService: FavoritesService) {}

    @ApiOperation({ summary: 'Save a NFT' })
    @ApiOkResponse({
        description: 'Successfully saved the nft',
        schema: { example: { statusCode: 200, message: 'NFT saved successfully' } },
    })
    @Post('/:nftId/add')
    async saveNFT(
        @Param('nftId', ParseIntPipe) nftId: number,
        @Req() req: Request,
    ) {
        return await this.favoritesService.saveNFT(nftId, (req.user as any));
    }

    @ApiOperation({ summary: 'Get Saved NFTs' })
    @ApiOkResponse({
        description: 'Returns a list of saved nfts',
        schema: {
            example: {
                statusCode: 200,
                data: [
                    { nftId: 1, title: 'First NFT', content: 'NFT content here...' },
                    { nftId: 2, title: 'Another NFT', content: 'More content here...' },
                ],
            },
        },
    })
    @Get()
    async getSavedNFTs(
        @Req() req: Request,
    ) {
        return await this.favoritesService.getSavedNFTs((req.user as any));
    }
}
