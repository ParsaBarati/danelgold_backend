import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {MarketplaceEntity} from './entity/market-place.entity';
import {PaginationService} from '@/common/paginate/pagitnate.service';
import {FilterMarketplacesDto} from './dto/filter-marketplace.dto';
import {createResponse} from '@/utils/response.util';
import {MarketplaceWithFloorPrice} from './interface/marketplaceWithFloorPrice.interface';

@Injectable()
export class MarketplaceService {
    constructor(
        @InjectRepository(MarketplaceEntity)
        private marketplaceRepository: Repository<MarketplaceEntity>,
        private paginationService: PaginationService,
    ) {
    }

    async filterMarketplaces(dto: FilterMarketplacesDto): Promise<any> {
        const {
            blockchainId,
            priceMin,
            priceMax,
            currency,
            typeId,
            days = 30,
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
                'marketplace.id',
                'marketplace.name',
                'marketplace.icon',
                'marketplace.currency',
                'MIN(nft.price) AS floorPrice',
            ])
            .andWhere(`marketplace.createdAt >= NOW() - INTERVAL '${days} DAY'`)
            .groupBy('marketplace.id')
            .orderBy(`marketplace.id`, sortOrder)
            .skip((page - 1) * limit)
            .take(limit);

        if (currency) {
            queryBuilder.andWhere(`marketplace.currency = :currency`, {currency});
        }
// Apply price filters only if valid values are provided
        if (priceMin > 0 && priceMax > 0) {
            queryBuilder.andWhere('nft.price BETWEEN :priceMin AND :priceMax', {priceMin, priceMax});
        } else if (priceMin > 0) {
            queryBuilder.andWhere('nft.price >= :priceMin', {priceMin});
        } else if (priceMax > 0) {
            queryBuilder.andWhere('nft.price <= :priceMax', {priceMax});
        }

// Add search filter if searchQuery is provided
        if (searchQuery && searchQuery.length > 0) {
            queryBuilder.andWhere('marketplace.name ILIKE :searchQuery', {
                searchQuery: `%${searchQuery}%`,
            });
        }

// Execute pagination
        const paginationResult = await this.paginationService.paginate(queryBuilder, page, limit);

// Cast paginationResult data to MarketplaceWithFloorPrice[]
        const marketplaces: MarketplaceWithFloorPrice[] = paginationResult.data.map((marketplace) => ({
            id: marketplace.id,
            name: marketplace.name,
            icon: marketplace.icon,
            floorPrice: parseFloat(marketplace.floorPrice.toString()), // Ensure floorPrice is a number
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
