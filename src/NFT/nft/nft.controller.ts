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
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { NFTsService } from '@/NFT/nft/nft.service';
import { MintNFTDataDto, MintNFTDto } from './dto/MintNFT.dto';
import { IPFSService } from '@/services/IPFS.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

@ApiExcludeController()
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
    const artist = (req.user as any).phone;
    const NFTImageURL = await this.ipfsService.uploadFileToIPFS(imageURL);
  
    return await this.nftsService.mintNFT(
      artist,
      mintNFTDataDto.name,
      mintNFTDataDto.price,
      NFTImageURL, 
    );
  }

  @Delete('/:nftId')
  async burnNFT(@Param('nftId') nftId: number, @Req() req: Request) {
    const currentOwnerIdentifier = (req.user as any).phone || (req.user as any).email;
    return await this.nftsService.burnNFT(nftId, currentOwnerIdentifier);
  }

  @Get('/:nftId')
  async getNFTById(@Param('nftId') nftId: number) {
    return this.nftsService.getNFTById(nftId);
  }
}
