import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/user/user/entity/user.entity';
import { NFT } from '@/nft/nft/entity/nft.entity';
import { CollectionEntity } from '@/market/collection/entity/collection.entity';
import { CreateCollectionDto } from '@/market/collection/dto/CreateCollection.dto';
import { UpdateCollectionDto } from '@/market/collection/dto/UpdateCollection.dto';
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
    creatorIdentifier: string
  ): Promise<ApiResponses<CollectionEntity>> {

    const { name, text, cover } = createCollectionDto

    const creator = await this.userRepository.findOne({
      where: [{ phone: creatorIdentifier }, { email: creatorIdentifier }]
    })

    if(!creator){
      throw new NotFoundException('User not found')
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
    currentOwnerIdentifier: string,
  ):Promise<ApiResponses<CollectionEntity>>{

    const collection = await this.collectionsRepository.findOne({
      where:{ id: collectionId },
      relations:['nfts']
    })

    if(!collection){
      throw new NotFoundException('مجموعه یافت نشد')
    }

    const isOwner = collection.creatorIdentifier === currentOwnerIdentifier;

    if (!isOwner) {
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
        'user.username',
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
        'collectionUser.username',
      ])
      .addSelect([
        'nftUser.username',
      ])
      .where('collections.id = :collectionId', { collectionId })

      return createResponse(200,existingCollection)
  }

  async addNftToCollection(
    nftId: number,
    collectionId: number,
    currentOwnerIdentifier: string,
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
  
    const isOwner = nft.ownerIdentifier === currentOwnerIdentifier;
    if (!isOwner) {
      throw new ForbiddenException('فقط مالک می‌تواند این NFT را به مجموعه اضافه کند');
    }
  
    nft.collectionEntity = collection;
    await this.nftsRepository.save(nft);
  
    return { message: 'NFT با موفقیت به مجموعه اضافه شد' };
  }

  async removeNftFromCollection(
    nftId: number,
    currentOwnerIdentifier: string,
  ): Promise<{ message: string }> {

    const nft = await this.nftsRepository.findOne({
      where: { id: nftId },
      relations: ['owner', 'collection'],
    });
  
    if (!nft) {
      throw new NotFoundException('NFT پیدا نشد');
    }
  
    const isOwner = nft.ownerIdentifier === currentOwnerIdentifier;
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
