import { Controller, Get, Post, Put, Delete, Body, Param, Req, Query, DefaultValuePipe, ParseIntPipe, UseInterceptors, UploadedFile, BadRequestException, HttpStatus, ParseFilePipeBuilder } from '@nestjs/common';
import { NFTsService } from '@/nft/nft.service';
import { MintNFTDto } from './dto/MintNFT.dto';
import { Request } from 'express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { IPFSService } from '@/services/IPFS.service';

@ApiTags('NFT')
@ApiBearerAuth()
@Controller('nft')
export class NFTsController {
  constructor(
    private readonly nftsService: NFTsService,
    private readonly ipfsService: IPFSService
  ) {}

  @Post('mint')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: MintNFTDto,
  })
  @UseInterceptors(FileInterceptor('imageURL'))
  @ApiOperation({ summary: 'Mint a new NFT' })
  @ApiResponse({
    status: 201,
    description: 'The NFT has been successfully minted.',
  })
  async mintNFT(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'image/jpeg,image/png,image/webp,image/svg+xml' })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
    @Body() mintNFTDto: MintNFTDto,
    @Req() req: Request
  ) {
    const creatorPhone = (req.user as any).result.phone;

    const imageURL = await this.ipfsService.uploadToIPFS(file.buffer);

    const updatedMintNFTDto: MintNFTDto = {
      ...mintNFTDto,
      imageURL, 
    };

    return await this.nftsService.mintNFT(updatedMintNFTDto, creatorPhone);
  }

  @Delete('/:nftId')
  async burnNFT(
    @Param('nftId', ParseIntPipe) nftId: number,
    @Req() req: Request
  ) {
    const currentOwnerPhone = (req.user as any).result.phone;
    const currentUserRoles = (req.user as any).result.role;
    return await this.nftsService.burnNFT(
      nftId,
      currentOwnerPhone,
      currentUserRoles
    );
  }

  @Get('/:nftId')
  async getNFTById(
    @Param('nftId', ParseIntPipe) nftId: number
  ) {
    return this.nftsService.getNFTById(nftId);
  }
}
