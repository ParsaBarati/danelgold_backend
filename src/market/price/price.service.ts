import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PriceEntity } from './entity/price.entity';
import { NFT } from '@/nft/nft/entity/nft.entity';
import { FilterCollectionsDto } from '../collection/dto/FilterCollection.dto';
import { CollectionEntity } from '../collection/entity/collection.entity';
import { createResponse } from '@/utils/response.util';
import { PaginationService } from '@/common/paginate/pagitnate.service';

@Injectable()
export class PricesService {
  constructor(
    @InjectRepository(PriceEntity)
    private priceRepository: Repository<PriceEntity>,
    @InjectRepository(CollectionEntity)
    private collectionRepository: Repository<CollectionEntity>,
    @InjectRepository(NFT)
    private nftRepository: Repository<NFT>,
    private readonly paginationService: PaginationService
  ) {}

  async getPrices(): Promise<any> {
    const nftPrices = await this.nftRepository
      .createQueryBuilder('nft')
      .leftJoinAndSelect('nft.collectionEntity', 'collection')
      .select('collection.id', 'collectionId')
      .addSelect('SUM(nft.price)', 'collectionPrice')
      .groupBy('collection.id')
      .getRawMany();

    return {
      stories: [],
      priceChanges: nftPrices.map((nftPrice) => ({
        collection: {
          id: nftPrice.collectionId,
          name: nftPrice.collectionName,  // Assuming collection name is fetched as well
          icon: nftPrice.collectionIcon,  // Assuming collection icon is fetched as well
        },
        floorPrice: nftPrice.collectionPrice,
        floorChange: 0, // Placeholder; compute as needed
        volume: 0,      // Placeholder; compute as needed
        volumeChange: 0, // Placeholder; compute as needed
        items: '0',      // Placeholder; compute as needed
        owners: 0,       // Placeholder; compute as needed
        currency: 'USD', // Placeholder or dynamic based on your app logic
      })),
    };
  }

  async filterCollections(dto: FilterCollectionsDto): Promise<any> {
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
    } = dto;

    const queryBuilder = this.collectionRepository
      .createQueryBuilder('collection')
      .leftJoinAndSelect('collection.nfts', 'nft')
      .select([
        'collection.id',
        'collection.name',
        'collection.cover AS icon',
        'MIN(nft.price) AS floorPrice',
        'nft.currency AS currency'
      ])
      .where('nft.price BETWEEN :priceMin AND :priceMax', { priceMin, priceMax })
      .andWhere('nft.blockchainId = :blockchainId', { blockchainId })
      .andWhere('nft.typeId = :typeId', { typeId })
      .andWhere('nft.currency = :currency', { currency })
      .andWhere('collection.createdAt >= NOW() - INTERVAL :days DAY', { days })
      .orderBy(`collection.${sort}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit)
      .groupBy('collection.id')
      .addGroupBy('nft.currency');

    // Add search filter if searchQuery is provided
    if (searchQuery) {
      queryBuilder.andWhere('collection.name ILIKE :searchQuery', {
        searchQuery: `%${searchQuery}%`,
      });
    }

    const paginationResult = await this.paginationService.paginate(
      queryBuilder,
      page,
      limit,
    );

    return createResponse(200, paginationResult);
  }
}
