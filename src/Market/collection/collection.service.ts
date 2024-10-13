import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '@/User/user/entity/user.entity';
import { NFT } from '@/NFT/nft/entity/nft.entity';
import { CollectionEntity } from '@/Market/collection/entity/collection.entity';
import { CreateCollectionDto } from '@/Market/collection/dto/CreateCollection.dto';
import { UpdateCollectionDto } from '@/Market/collection/dto/UpdateCollection.dto';
import { PaginationResult, PaginationService } from '@/common/paginate/pagitnate.service';
import { ApiResponses, createResponse } from '@/utils/response.util';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(CollectionEntity)
    private collectionsRepository: Repository<CollectionEntity>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(NFT)
    private nftsRepository: Repository<NFT>,

    private readonly paginationService: PaginationService
  ) {}

  async createCollection(
    createCollectionDto: CreateCollectionDto,
    creatorPhone: string
  ): Promise<ApiResponses<CollectionEntity>> {

    const { name, text, cover } = createCollectionDto

    const creator = await this.userRepository.findOne({
      where:{ phone:creatorPhone}
    })

    if(!creator){
      throw new NotFoundException('کاربر یافت نشد')
    }
    
    const collection = {
      name,
      text,
      cover,
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

    if (updateCollectionDto.text !== undefined){
      collection.text = updateCollectionDto.text
    }

    if (updateCollectionDto.cover !== undefined){
      collection.cover = updateCollectionDto.cover
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
      .leftJoinAndSelect('collections.user','user')
      .select([
        'collections.id',
        'collections.name',
        'collections.text',
        'collections.cover',
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
      .leftJoinAndSelect('nfts.user','nftUser')
      .select([
        'collections.id',
        'collections.name',
        'collections.text',
        'collections.cover',
        'collections.creatorPhone',
        'collections.createdAt',
        'collections.updatedAt'
      ])
      .addSelect([
        'nft.id',
        'nft.name',
        'nft.description',
        'nft.image',
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

  async addNftToCollection(
    nftId: number,
    collectionId: number,
    currentOwnerPhone: string,
  ): Promise<{ message: string }> {

    const nft = await this.nftsRepository.findOne({
      where: { id: nftId },
      relations: ['owner'],
    });
  
    const collection = await this.collectionsRepository.findOne({
      where: { id: collectionId },
    });
  
    if (!nft) {
      throw new NotFoundException('NFT پیدا نشد');
    }
    if (!collection) {
      throw new NotFoundException('مجموعه پیدا نشد');
    }
  
    const isOwner = nft.ownerPhone === currentOwnerPhone;
    if (!isOwner) {
      throw new ForbiddenException('فقط مالک می‌تواند این NFT را به مجموعه اضافه کند');
    }
  
    nft.collectionEntity = collection;
    await this.nftsRepository.save(nft);
  
    return { message: 'NFT با موفقیت به مجموعه اضافه شد' };
  }

  async removeNftFromCollection(
    nftId: number,
    currentOwnerPhone: string,
  ): Promise<{ message: string }> {

    const nft = await this.nftsRepository.findOne({
      where: { id: nftId },
      relations: ['owner', 'collection'],
    });
  
    if (!nft) {
      throw new NotFoundException('NFT پیدا نشد');
    }
  
    const isOwner = nft.ownerPhone === currentOwnerPhone;
    if (!isOwner) {
      throw new ForbiddenException('فقط مالک می‌تواند این NFT را از مجموعه حذف کند');
    }
  
    if (!nft.collectionEntity) {
      throw new BadRequestException('NFT در هیچ مجموعه‌ای نیست');
    }
  
    nft.collectionEntity = null;
    await this.nftsRepository.save(nft);
  
    return { message: 'NFT با موفقیت از مجموعه حذف شد' };
  }
  
  
}
