import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query, DefaultValuePipe, Req } from '@nestjs/common';
import { UserRole } from '@/User/user/entity/user.entity';
import { AuctionsService } from '@/Market/auction/auction.service';
import { UpdateAuctionDto } from '@/Market/auction/dto/UpdateAuction.dto';
import { CreateAuctionDto } from '@/Market/auction/dto/CreateAuction.dto';
import { ParticipateAuctionDto } from '@/Market/auction/dto/ParticipateAuction.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '@/common/decorators/roles.decorator';
import { Request } from 'express';

@ApiTags('Auction')
@ApiBearerAuth()
@Controller('auction')
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Roles(UserRole.ADMIN)
  @Post()
  async createAuction(
    @Req() req:Request,
    @Body() createAuctionDto: CreateAuctionDto
  ){
    const creatorPhone = (req.user as any).result.phone;
    return await this.auctionsService.createAuction(creatorPhone,createAuctionDto);
  }

  @Post('participate/:id')
  async participateAuction(
    @Param('id') auctionId: number,
    @Body() participateAuctionDto: ParticipateAuctionDto,
    @Req() req: Request
  ){
    const userPhone = (req.user as any).result.phone;
    return this.auctionsService.participateAuction(
      auctionId, 
      participateAuctionDto, 
      userPhone
    );
  }

  @Roles(UserRole.ADMIN)
  @Put('/:id')
  updateAuction(
    @Param('id') id: number, 
    @Body() updateAuctionDto: UpdateAuctionDto
  ){
    return this.auctionsService.updateAuction(id, updateAuctionDto);
  }

  @Roles(UserRole.ADMIN)
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
