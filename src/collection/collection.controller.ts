import { Controller, Get, Post, Put, Delete, Body, Param, Req, ParseIntPipe, Query, DefaultValuePipe } from '@nestjs/common';
import { CollectionsService } from '@/collection/collection.service';
import { CollectionEntity } from '@/collection/entity/collection.entity';
import { Request } from 'express';
import { CreateCollectionDto } from '@/collection/dto/CreateCollection.dto';
import { UpdateCollectionDto } from '@/collection/dto/UpdateCollection.dto';

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
  getAllCollections(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('sortBy') sort?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ){
    const query = { page, limit, search, sort, sortOrder };
    return this.collectionsService.getAllCollections(query);
  }

}
