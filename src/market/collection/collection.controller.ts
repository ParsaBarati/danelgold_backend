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
import { ApiBearerAuth, ApiExcludeController, ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CollectionsService } from '@/market/collection/collection.service';
import { CreateCollectionDto } from '@/market/collection/dto/CreateCollection.dto';
import { UpdateCollectionDto } from '@/market/collection/dto/UpdateCollection.dto';
import { Request } from 'express';

@ApiTags('collection')
@ApiBearerAuth()
@Controller('collection')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @ApiExcludeEndpoint()
  @Post()
  async createCollection(
    @Req () req: Request,
    @Body() createCollectionDto:CreateCollectionDto
  ){
    const creatorIdentifier = (req.user as any).phone || (req.user as any).email;
    return await this.collectionsService.createCollection(createCollectionDto,creatorIdentifier)
  }

  @ApiExcludeEndpoint()
  @Post(':/collectionId/add/nftId')
  async addNftToCollection(
    @Param('collectionId',ParseIntPipe) collectionId:number,
    @Param('nftId',ParseIntPipe) nftId:number,
    @Req () req:Request
  ){
    const currentOwnerIdentifier = (req.user as any).phone || (req.user as any).email;
    return await this.collectionsService.addNftToCollection(
      collectionId,
      nftId,
      currentOwnerIdentifier
    )
  }

  @ApiExcludeEndpoint()
  @Post(':/collectionId/remove/nftId')
  async removeNftFromCollection(
    @Param('nftId',ParseIntPipe) nftId:number,
    @Req () req:Request
  ){
    const currentOwnerIdentifier = (req.user as any).phone || (req.user as any).email;
    return await this.collectionsService.removeNftFromCollection(
      nftId,
      currentOwnerIdentifier
    )
  }

  @ApiExcludeEndpoint()
  @Put('/:id')
  async updateCollection(
    @Param(':collectionId',ParseIntPipe) collectionId: number,
    @Req () req: Request,
    @Body() updateCollectionDto: UpdateCollectionDto
  ){
    const currentOwnerIdentifier = (req.user as any).phone || (req.user as any).email;
    return await this.collectionsService.updateCollection(
      collectionId,
      updateCollectionDto,
      currentOwnerIdentifier,
    )
  }

  @ApiOperation({ summary: 'Watchlist Base On APi' })
  @Post('watchlist')
    async getCollections(
      @Body() query: any
    ){
        return this.collectionsService.getCollections(query);
    }

    
  @ApiExcludeEndpoint()
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

  @ApiExcludeEndpoint()
  @Get('/:id')
  async getCollectionById(
    @Param('collectionId',ParseIntPipe) collectionId:number
  ){
    return await this.collectionsService.getAuctionById(collectionId)
  }

}
