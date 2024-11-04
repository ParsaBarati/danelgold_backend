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
import { PriceEntity } from '../price/entity/price.entity';
import { WatchlistResponseDto } from './dto/collectio-response.dto';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(CollectionEntity)
    private collectionsRepository: Repository<CollectionEntity>,
    @InjectRepository(PriceEntity)
    private priceRepository: Repository<PriceEntity>,
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

  async getCollections(query: any): Promise<WatchlistResponseDto> {
    const { 
        blockchainId, 
        priceMin, 
        priceMax, 
        currency, 
        typeId, 
        days, 
        searchQuery,
        page = 1,
        limit = 10,
        sort = 'id',
        sortOrder = 'DESC',
    } = query;

    // Calculate the offset for pagination
    const offset = (page - 1) * limit;

    // Query to fetch collections with pagination
    const [collections, total] = await this.collectionsRepository
        .createQueryBuilder('collection')
        .leftJoinAndSelect('collection.priceChanges', 'price') // Join prices
        .select([
            'collection.id',
            'collection.name',
            'collection.icon',
            'price.floorPrice',
            'price.floorChange',
            'price.volume',
            'price.volumeChange',
            'price.items',
            'price.owners',
            'price.currency',
        ])
        .where('collection.blockchainId = :blockchainId', { blockchainId })
        .andWhere('price.floorPrice BETWEEN :priceMin AND :priceMax', { priceMin, priceMax })
        .andWhere('price.currency = :currency', { currency })
        .andWhere('collection.typeId = :typeId', { typeId })
        .andWhere('collection.days <= :days', { days })
        .andWhere('(collection.name ILIKE :searchQuery OR collection.description ILIKE :searchQuery)', {
            searchQuery: `%${searchQuery}%`,
        })
        .orderBy(`collection.${sort}`, sortOrder)
        .take(limit) // Set the limit for pagination
        .skip(offset) // Set the offset for pagination
        .getManyAndCount(); // Get both results and count

    return {
        collections: collections.map(collection => {
            // Assume the latest price is the last in the array
            const latestPrice = collection.priceChanges[collection.priceChanges.length - 1];

            return {
                id: collection.id,
                name: collection.name,
                icon: collection.cover,
                floorPrice: latestPrice ? latestPrice.floorPrice : null,
                floorChange: latestPrice ? latestPrice.floorChange : null,
                volume: latestPrice ? latestPrice.volume : null,
                volumeChange: latestPrice ? latestPrice.volumeChange : null,
                items: latestPrice ? latestPrice.items : null,
                owners: latestPrice ? latestPrice.owners : null,
                currency: latestPrice ? latestPrice.currency : null,
            };
        }),
        page,
        limit, 
    };
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
