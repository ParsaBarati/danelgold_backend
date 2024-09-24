import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Body, 
  Param, 
  Req, 
  ParseIntPipe, 
  Query, 
  DefaultValuePipe 
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CollectionsService } from '@/Market/collection/collection.service';
import { CreateCollectionDto } from '@/Market/collection/dto/CreateCollection.dto';
import { UpdateCollectionDto } from '@/Market/collection/dto/UpdateCollection.dto';
import { Request } from 'express';

@ApiTags('Collection')
@ApiBearerAuth()
@Controller('collection')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post()
  async createCollection(
    @Req () req: Request,
    @Body() createCollectionDto:CreateCollectionDto
  ){
    const creatorPhone = (req.user as any).result.phone;
    return await this.collectionsService.createCollection(createCollectionDto,creatorPhone)
  }

  @Post(':/collectionId/add/nftId')
  async addNftToCollection(
    @Param('collectionId',ParseIntPipe) collectionId:number,
    @Param('nftId',ParseIntPipe) nftId:number,
    @Req () req:Request
  ){
    const currentOwnerPhone = (req.user as any).result.phone;
    return await this.collectionsService.addNftToCollection(
      collectionId,
      nftId,
      currentOwnerPhone
    )
  }

  @Post(':/collectionId/remove/nftId')
  async removeNftFromCollection(
    @Param('nftId',ParseIntPipe) nftId:number,
    @Req () req:Request
  ){
    const currentOwnerPhone = (req.user as any).result.phone;
    return await this.collectionsService.removeNftFromCollection(
      nftId,
      currentOwnerPhone
    )
  }

  @Put('/:id')
  async updateCollection(
    @Param(':collectionId',ParseIntPipe) collectionId: number,
    @Req () req: Request,
    @Body() updateCollectionDto: UpdateCollectionDto
  ){
    const currentOwnerPhone = (req.user as any).result.phone;
    const currentUserRoles = (req.user as any).result.role;
    return await this.collectionsService.updateCollection(
      collectionId,
      updateCollectionDto,
      currentOwnerPhone,
      currentUserRoles
    )
  }

  @Get('all')
  async getAllCollections(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('sortBy') sort?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ){
    const query = { page, limit, search, sort, sortOrder };
    return await this.collectionsService.getAllCollections(query);
  }

  @Get('/:id')
  async getCollectionById(
    @Param('collectionId',ParseIntPipe) collectionId:number
  ){
    return await this.collectionsService.getAuctionById(collectionId)
  }

}
