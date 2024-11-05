import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketplaceEntity } from './entity/market-place.entity';
import { PaginationService } from '@/common/paginate/pagitnate.service';
import { FilterMarketplacesDto } from './dto/filter-marketplace.dto';
import { createResponse } from '@/utils/response.util';
import { MarketplaceWithFloorPrice } from './interface/marketplaceWithFloorPrice.interface';

@Injectable()
export class MarketplaceService {
  constructor(
    @InjectRepository(MarketplaceEntity)
    private marketplaceRepository: Repository<MarketplaceEntity>,
    
    private paginationService: PaginationService,
  ) {}

  async filterMarketplaces(dto: FilterMarketplacesDto): Promise<any> {
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
  
    const queryBuilder = this.marketplaceRepository
      .createQueryBuilder('marketplace')
      .leftJoinAndSelect('marketplace.nfts', 'nft')
      .select([
        'marketplace.id AS id',
        'marketplace.name AS name',
        'marketplace.icon AS icon',
        'MIN(nft.price) AS floorPrice',
        'nft.currency AS currency'
      ])
      .where('nft.price BETWEEN :priceMin AND :priceMax', { priceMin, priceMax })
      .andWhere('nft.blockchainId = :blockchainId', { blockchainId })
      .andWhere('nft.typeId = :typeId', { typeId })
      .andWhere('nft.currency = :currency', { currency })
      .andWhere('marketplace.createdAt >= NOW() - INTERVAL :days DAY', { days })
      .groupBy('marketplace.id')
      .addGroupBy('nft.currency')
      .orderBy(`marketplace.${sort}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);
  
    // Add search filter if searchQuery is provided
    if (searchQuery) {
      queryBuilder.andWhere('marketplace.name ILIKE :searchQuery', {
        searchQuery: `%${searchQuery}%`,
      });
    }
  
    const paginationResult = await this.paginationService.paginate(queryBuilder, page, limit);
  
    // Cast paginationResult data to MarketplaceWithFloorPrice[]
    const marketplaces: MarketplaceWithFloorPrice[] = paginationResult.data.map((marketplace) => ({
        id: marketplace.id,
        name: marketplace.name,
        icon: marketplace.icon,
        floorPrice: parseFloat(marketplace.floorPrice.toString()), // Ensure it's a number
        currency: marketplace.currency.toString(), // Ensure currency is a string
    }));
    
  
    return createResponse(200, {
      marketplaces,
      total: paginationResult.total,
      page: paginationResult.page,
      limit: paginationResult.limit,
    });
  }
  
  
}
