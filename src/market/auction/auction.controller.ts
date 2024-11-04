import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query, DefaultValuePipe, Req } from '@nestjs/common';
import { AuctionsService } from '@/market/auction/auction.service';
import { UpdateAuctionDto } from '@/market/auction/dto/UpdateAuction.dto';
import { CreateAuctionDto } from '@/market/auction/dto/CreateAuction.dto';
import { ParticipateAuctionDto } from '@/market/auction/dto/ParticipateAuction.dto';
import { ApiBearerAuth, ApiExcludeController, ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '@/common/decorators/roles.decorator';
import { Request } from 'express';
import { AuctionsResponseDto } from './dto/filter-auction.dto';

@ApiTags('auction')
@ApiBearerAuth()
@Controller('auction')
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @ApiExcludeEndpoint()
  @Post()
  async createAuction(
    @Req() req:Request,
    @Body() createAuctionDto: CreateAuctionDto
  ){
    const creatorPhone = (req.user as any).phone;
    return await this.auctionsService.createAuction(creatorPhone,createAuctionDto);
  }

  @ApiExcludeEndpoint()
  @Post('participate/:id')
  async participateAuction(
    @Param('id') auctionId: number,
    @Body() participateAuctionDto: ParticipateAuctionDto,
    @Req() req: Request
  ){
    const userIdentifier = (req.user as any).phone || (req.user as any).email;
    return this.auctionsService.participateAuction(
      auctionId, 
      participateAuctionDto, 
      userIdentifier
    );
  }

  @ApiExcludeEndpoint()
  @Put('/:id')
  updateAuction(
    @Param('id') id: number, 
    @Body() updateAuctionDto: UpdateAuctionDto
  ){
    return this.auctionsService.updateAuction(id, updateAuctionDto);
  }

  @ApiExcludeEndpoint()
  @Delete('/:id')
  remove(
    @Param('id',ParseIntPipe) id: number
  ){
    return this.auctionsService.deleteAuction(id);
  }

  @ApiOperation({ summary: 'Get Drops Base On Api' })
  @Get('drops')
  async getAuctions(): Promise<AuctionsResponseDto> {
      return this.auctionsService.getAuctions();
  }

  @ApiExcludeEndpoint()
  @Get('/:id')
  getAuctionById(
    @Param('id',ParseIntPipe) id: number
  ) {
    return this.auctionsService.getAuctionById(id);
  }

}
