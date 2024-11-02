import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query, DefaultValuePipe, Req } from '@nestjs/common';
import { AuctionsService } from '@/market/auction/auction.service';
import { UpdateAuctionDto } from '@/market/auction/dto/UpdateAuction.dto';
import { CreateAuctionDto } from '@/market/auction/dto/CreateAuction.dto';
import { ParticipateAuctionDto } from '@/market/auction/dto/ParticipateAuction.dto';
import { ApiBearerAuth, ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { Roles } from '@/common/decorators/roles.decorator';
import { Request } from 'express';

@ApiExcludeController()
@Controller('auction')
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Post()
  async createAuction(
    @Req() req:Request,
    @Body() createAuctionDto: CreateAuctionDto
  ){
    const creatorPhone = (req.user as any).phone;
    return await this.auctionsService.createAuction(creatorPhone,createAuctionDto);
  }

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

  @Put('/:id')
  updateAuction(
    @Param('id') id: number, 
    @Body() updateAuctionDto: UpdateAuctionDto
  ){
    return this.auctionsService.updateAuction(id, updateAuctionDto);
  }

  @Delete('/:id')
  remove(
    @Param('id',ParseIntPipe) id: number
  ){
    return this.auctionsService.deleteAuction(id);
  }

  @Get('all')
  getAllAuctions(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('sortBy') sort?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ){
    const query = { page, limit, search, sort, sortOrder };
    return this.auctionsService.getAllAuctions(query);
  }

  @Get('/:id')
  getAuctionById(
    @Param('id',ParseIntPipe) id: number
  ) {
    return this.auctionsService.getAuctionById(id);
  }

}
