import { Controller, Get, Post, Put, Delete, Body, Param, Req, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { NFTsService } from '@/nft/nft.service';
import { NFT } from '@/nft/entity/nft.entity';
import { MintNFTDto } from './dto/MintNFT.dto';
import { Request } from 'express';
import { UpdateNFTDto } from './dto/UpdateNFT.dto';

@Controller('nft')
export class NFTsController {
  constructor(private readonly nftsService: NFTsService) {}

  @Post()
  async MintNFT(
    @Req () req: Request,
    @Body() mintNFTDto: MintNFTDto
  ){
    const creatorPhone = (req.user as any).result.phone
    return await this.nftsService.mintNFT(mintNFTDto,creatorPhone);
  }

  @Put('/:id')
  async updateMint(
    @Param('nftId',ParseIntPipe) nftId: number,
    @Req () req: Request,
    @Body() updateNFTDto: UpdateNFTDto
  ){
    const currentOwnerPhone = (req.user as any).result.phone;
    const currentUserRoles = (req.user as any).result.role;
    return await this.nftsService.updateNFT(
      nftId,
      updateNFTDto,
      currentOwnerPhone,
      currentUserRoles
    )
  }

  @Delete('/:id')
  async burnNFT(
    @Param('nftId',ParseIntPipe) nftId:number,
    @Req () req:Request
  ){
    const currentOwnerPhone = (req.user as any).result.phone;
    const currentUserRoles = (req.user as any).result.role;
    return await this.nftsService.burnNFT(
      nftId,
      currentOwnerPhone,
      currentUserRoles
    )
  }

  @Get('/:id')
  async getNFTById(
    @Param('nftId',ParseIntPipe) nftId: number
  ){
    return this.nftsService.getNFTById(nftId);
  }
}
