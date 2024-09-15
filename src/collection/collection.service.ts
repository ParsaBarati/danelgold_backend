import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollectionEntity } from '@/collection/entity/collection.entity';
import { CreateCollectionDto } from '@/collection/dto/CreateCollection.dto';
import { ApiResponses, createResponse } from '@/utils/response.util';
import { User, UserRole } from '@/user/entity/user.entity';
import { UpdateCollectionDto } from '@/collection/dto/UpdateCollection.dto';
import { PaginationResult, PaginationService } from '@/common/paginate/pagitnate.service';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(CollectionEntity)
    private collectionsRepository: Repository<CollectionEntity>,
    @InjectRepository(User)
    private userRepository: Repository<User>,

    private readonly paginationService: PaginationService
  ) {}

  async createCollection(
    createCollectionDto: CreateCollectionDto,
    creatorPhone: string
  ): Promise<ApiResponses<CollectionEntity>> {

    const { name, description } = createCollectionDto

    const creator = await this.userRepository.findOne({
      where:{ phone:creatorPhone}
    })

    if(!creator){
      throw new NotFoundException('کاربر یافت نشد')
    }
    
    const collection = {
      name,
      description,
      creator,
      createdAt: new Date()
    }

    const newCollection = await this.collectionsRepository.save(collection)

    return createResponse(201,newCollection)
  }

  async updateCollection(
    collectionId: number,
    updateCollectionDto: UpdateCollectionDto,
    currentOwnerPhone: string,
    currentUserRoles: string[]
  ):Promise<ApiResponses<CollectionEntity>>{

    const collection = await this.collectionsRepository.findOne({
      where:{ id: collectionId },
      relations:['nfts']
    })

    if(!collection){
      throw new NotFoundException('مجموعه یافت نشد')
    }

    const isOwner = collection.creatorPhone === currentOwnerPhone;
    const isAdmin = currentUserRoles.includes(UserRole.ADMIN);

    if (!isOwner && !isAdmin) {
      throw new BadRequestException('شما مجاز به ویرایش نیستید'); 
    }

    if (updateCollectionDto.name !== undefined){
      collection.name = updateCollectionDto.name
    }

    if (updateCollectionDto.description !== undefined){
      collection.description = updateCollectionDto.description
    }

    collection.updatedAt = new Date();

    const updatedCollection = await this.collectionsRepository.save(collection)

    return createResponse(200,updatedCollection)
  }

  async getAllCollections(
    query: any
  ): Promise<ApiResponses<PaginationResult<any>>> {

    const {
      page = 1,
      limit = 10,
      search,
      sort = 'id',
      sortOrder = 'DESC',
    } = query;

    const queryBuilder = this.collectionsRepository
      .createQueryBuilder('collections')
      .leftJoinAndSelect('collections.users','user')
      .select([
        'collections.id',
        'collections.name',
        'collections.description',
        'collections.createdAt',
        'collections.updatedAt'
      ])
      .addSelect([
        'user.firstName',
        'user.lastName'
      ])
      .orderBy(`collections.${sort}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

      const paginationResult = await this.paginationService.paginate(
        queryBuilder,
        page,
        limit,
      );

      if(search){
        queryBuilder.andWhere('(collections.name ILIKE :search)', 
          {search: `%${search}%`} 
        )
      }

      return createResponse(200,paginationResult);
  }

  async getAuctionById(
    collectionId: number
  ): Promise<ApiResponses<any>> {
    
    const collection = await this.collectionsRepository.findOne({
       where: { id:collectionId }, 
       relations: ['nfts'] 
      });

    if(!collection){
      throw new NotFoundException('مزایده یافت نشد')
    }
    
    const existingCollection = await this.collectionsRepository
      .createQueryBuilder('collections')
      .leftJoinAndSelect('collections.nfts','nft')
      .leftJoinAndSelect('collections.user','collectionUser')
      .leftJoinAndSelect('nfts.users','nftUser')
      .select([
        'collections.id',
        'collections.name',
        'collections.description',
        'collections.creatorPhone',
        'collections.createdAt',
        'collections.updatedAt'
      ])
      .addSelect([
        'nft.id',
        'nft.name',
        'nft.description',
        'nft.imageUrl',
        'nft.matadataUrl',
        'nft.ownerPhone',
        'nft.creatorPhone',
        'nft.price',
        'nft.createdAt',
        'nft.updatedAt'
      ])
      .addSelect([
        'collectionUser.firstName',
        'collectionUser.lastName'
      ])
      .addSelect([
        'nftUser.firstName',
        'nftUser.lastName'
      ])
      .where('collections.id = :collectionId', { collectionId })

      return createResponse(200,existingCollection)
  }
}
