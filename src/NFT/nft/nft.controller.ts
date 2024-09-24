import { 
  Controller, 
  Get, 
  Post, 
  Delete, 
  Body, 
  Param, 
  Req, 
  UseInterceptors, 
  UploadedFile, 
  HttpStatus, 
  ParseFilePipeBuilder, 
  UsePipes, 
  ValidationPipe 
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { NFTsService } from '@/NFT/nft/nft.service';
import { MintNFTDataDto, MintNFTDto } from './dto/MintNFT.dto';
import { IPFSService } from '@/services/IPFS.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

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
  @ApiBody({ type: MintNFTDto })
  @UseInterceptors(FileInterceptor('imageURL'))
  @UsePipes(new ValidationPipe({ transform: true }))  
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
    const creatorPhone = (req.user as any).result.phone;
    const NFTImageURL = await this.ipfsService.uploadFileToIPFS(imageURL);
  
    return await this.nftsService.mintNFT(
      creatorPhone,
      mintNFTDataDto.name,
      mintNFTDataDto.price,
      NFTImageURL, 
      mintNFTDataDto.description,
    );
  }

  @Delete('/:nftId')
  async burnNFT(@Param('nftId') nftId: number, @Req() req: Request) {
    const currentOwnerPhone = (req.user as any).result.phone;
    const currentUserRoles = (req.user as any).result.role;
    return await this.nftsService.burnNFT(nftId, currentOwnerPhone, currentUserRoles);
  }

  @Get('/:nftId')
  async getNFTById(@Param('nftId') nftId: number) {
    return this.nftsService.getNFTById(nftId);
  }
}
