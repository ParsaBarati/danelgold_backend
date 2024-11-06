import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    ParseFilePipeBuilder,
    Post,
    Req,
    UploadedFile,
    UseInterceptors,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {ApiBody, ApiConsumes, ApiExcludeEndpoint, ApiOperation} from '@nestjs/swagger';
import {NFTsService} from '@/nft/nft/nft.service';
import {IPFSService} from '@/services/IPFS.service';
import {FileInterceptor} from '@nestjs/platform-express';
import {Request} from 'express';
import {MintNFTDataDto, MintNFTDto} from './dto/MintNFT.dto';
import {FilterNFTsDto} from './dto/filterNFT.dto';

@Controller('nft')
export class NFTsController {
    constructor(
        private readonly nftsService: NFTsService,
        private readonly ipfsService: IPFSService
    ) {
    }

    @ApiOperation({summary: 'Filter NFT base on Api'})
    @Post('filter')
    async filterNFTs(
        @Body() dto: FilterNFTsDto
    ) {
        return this.nftsService.filterNFTs(dto);
    }

    @ApiExcludeEndpoint()
    @Post('mint')
    @ApiConsumes('multipart/form-data')
    @ApiBody({type: MintNFTDto})
    @UseInterceptors(FileInterceptor('imageURL'))
    @UsePipes(new ValidationPipe({transform: true}))
    async mintNFT(
        @UploadedFile(
            new ParseFilePipeBuilder().build({
                errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            }),
        )
            imageURL: Express.Multer.File,
        @Body() mintNFTDataDto: MintNFTDataDto,
        @Req() req: Request,
    ) {
        const artist = (req.user as any).phone;
        const NFTImageURL = await this.ipfsService.uploadFileToIPFS(imageURL);

        return await this.nftsService.mintNFT(
            artist,
            mintNFTDataDto.name,
            mintNFTDataDto.price,
            NFTImageURL,
        );
    }

    @ApiExcludeEndpoint()
    @Delete('/:nftId')
    async burnNFT(@Param('nftId') nftId: number, @Req() req: Request) {
        const currentOwnerIdentifier = (req.user as any).phone || (req.user as any).email;
        return await this.nftsService.burnNFT(nftId, currentOwnerIdentifier);
    }

    @ApiExcludeEndpoint()
    @Get('/:nftId')
    async getNFTById(@Param('nftId') nftId: number) {
        return this.nftsService.getNFTById(nftId);
    }
}
