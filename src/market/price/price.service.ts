import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {PriceEntity} from './entity/price.entity';
import {NFT} from '@/nft/nft/entity/nft.entity';
import {FilterCollectionsDto} from '../collection/dto/FilterCollection.dto';
import {CollectionEntity} from '../collection/entity/collection.entity';
import {createResponse} from '@/utils/response.util';
import {PaginationService} from '@/common/paginate/pagitnate.service';
import {User} from "@/user/user/entity/user.entity";
import {FollowUser} from "@/social/follow/entity/follow.entity";

@Injectable()
export class PricesService {
    constructor(
        @InjectRepository(PriceEntity)
        private priceRepository: Repository<PriceEntity>,
        @InjectRepository(CollectionEntity)
        private collectionRepository: Repository<CollectionEntity>,
        @InjectRepository(NFT)
        private nftRepository: Repository<NFT>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private readonly paginationService: PaginationService
    ) {
    }

    async getPrices(page: number = 1, limit: number = 10): Promise<any> {
        // Ensure limit and page are positive
        page = Math.max(1, page);
        limit = Math.max(1, limit);

        // Query for paginated NFT prices grouped by collection
        const nftPrices = await this.nftRepository
            .createQueryBuilder('nft')
            .leftJoinAndSelect('nft.collectionEntity', 'collection')
            .select('collection.id', 'collectionid')
            .addSelect('collection.name', 'collectionname')
            .addSelect('collection.cover', 'collectioncover')
            .addSelect('SUM(nft.price)', 'collectionprice')
            .addSelect('COUNT(nft.id)', 'items') // Count of NFTs in the collection
            .addSelect('COUNT(DISTINCT nft.ownerId)', 'owners') // Count of unique owners
            .groupBy('collection.id')
            .skip((page - 1) * limit)
            .take(limit)
            .getRawMany();

        console.log("Fetched nftPrices:", nftPrices); // Debug: Log the fetched collection prices

        // Format the NFT prices by collection data
        const formattedNftPrices = nftPrices.map((nftPrice) => ({
            collection: {
                id: nftPrice.collectionid,
                name: nftPrice.collectionname,
                cover: nftPrice.collectioncover,
            },
            floorPrice: parseFloat(nftPrice.collectionprice) || 0,
            floorChange: 0,
            volume: 0,
            volumeChange: 0,
            items: parseInt(nftPrice.items, 10) || 0,
            owners: parseInt(nftPrice.owners, 10) || 0,
            currency: 'USD',
        }));

        // Fetch the latest users with followers count and cover image
        const latestUsers = await this.userRepository
            .createQueryBuilder('user')
            .leftJoin(FollowUser, 'followerrelation', 'followerrelation.followingId = "user"."id"')
            .select([
                '"user"."id" AS "user_id"',
                '"user"."username" AS "user_username"',
                '"user"."name" AS "user_name"',
                '"user"."profilePic" AS "user_profilepic"',
                '"user"."cover" AS "user_cover"',
                'COUNT(DISTINCT "followerrelation"."id") AS "followerscount"'
            ])
            .groupBy('"user"."id"')
            .orderBy('"user"."createdAt"', 'DESC')
            .limit(limit)
            .getRawMany();

        console.log("Fetched latestUsers:", latestUsers); // Debug: Log the fetched users

        // Format the user data to include followers count and cover image
        const formattedUsers = latestUsers.map((user) => ({
            id: user.user_id ?? 0,
            username: user.user_username ?? "",
            name: user.user_name ?? "",
            profilePic: user.user_profile,
            cover: user.user_cover ,
            followers: parseInt(user.followerscount, 10) || 0,
        }));

        // Query for NFTs grouped by their collections
        const collectionsWithNfts = await this.nftRepository
            .createQueryBuilder('nft')
            .leftJoinAndSelect('nft.collectionEntity', 'collection')
            .leftJoinAndSelect('nft.artist', 'artist') // Join the artist entity
            .select([
                'collection.id AS collectionid',
                'collection.name AS collectionname',
                'collection.cover AS collectioncover',
                'nft.id AS nftid',
                'nft.name AS nftname',
                'nft.price AS nftprice',
                'nft.image AS nftimage',
                'artist.id AS artistid',
                'artist.username AS artistname',
                'artist.profilePic AS artistprofilepic'
            ])
            .orderBy('collection.id')
            .skip((page - 1) * limit)
            .take(limit)
            .getRawMany();

        console.log("Fetched collectionsWithNfts:", collectionsWithNfts); // Debug: Log fetched NFTs grouped by collection

// Process the results to group NFTs under their respective collections
        const groupedNfts = collectionsWithNfts.reduce((acc, nft) => {
            const collectionId = nft.collectionid;

            // Check if the collection already exists in the accumulator
            if (!acc[collectionId]) {
                acc[collectionId] = {
                    collection: {
                        id: nft.collectionid ?? 0,
                        name: nft.collectionname ?? "",
                        cover: nft.collectioncover ?? "",
                    },
                    nfts: [],
                };
            }

            // Add the NFT with artist information to the collection's NFT list
            acc[collectionId].nfts.push({
                id: nft.nftid ?? 0,
                name: nft.nftname ?? "",
                price: nft.nftprice !== null ? parseFloat(nft.nftprice) : 0,
                image: nft.nftimage ?? "",
                artist: {
                    id: nft.artistid ?? 0,
                    name: nft.artistname,
                    profilePic: nft.artistprofile,
                },
            });

            return acc;
        }, {});

// Convert the grouped data from an object to an array format
        const formattedNfts = Object.values(groupedNfts);
        // Return the final response with priceChanges, latestUsers, and nfts
        return {
            priceChanges: formattedNftPrices,
            latestUsers: formattedUsers,
            nfts: formattedNfts ?? [],
            pagination: {
                currentPage: page,
                itemsPerPage: limit,
                hasNextPage: formattedNfts.length === limit,
            },
        };
    }

    async filterCollections(dto: FilterCollectionsDto): Promise<any> {
        const {
            blockchainId = 0,
            priceMin = 0,
            priceMax = 0,
            currency = 'USD',
            typeId = 1,
            days = 7,
            searchQuery = '',
            page = 1,
            limit = 10,
            sort = 'id',
            sortOrder = 'DESC',
        } = dto || {}; // fall back to an empty object if dto is null/undefined

        const queryBuilder = this.collectionRepository
            .createQueryBuilder('collection')
            .leftJoinAndSelect('collection.nfts', 'nft') // Using 'nfts' relation on CollectionEntity
            .select([
                'collection.id',
                'collection.name',
                'collection.cover',
                'MIN(nft.price) AS floorPrice',
                'COUNT(nft.id) AS itemCount',
                'COUNT(DISTINCT nft.ownerIdentifier) AS ownerCount' // Unique count for owners
            ])
            .andWhere(`collection.createdAt >= NOW() - INTERVAL '${days} days'`) // Syntax for time interval
            .groupBy('collection.id')
            .orderBy(`collection.${sort}`, sortOrder === "ASC" ? "ASC" : "DESC")
            .skip((page - 1) * limit)
            .take(limit);
        // Calculate the offset for pagination
        if (priceMin > 0 && priceMax > 0) {
            queryBuilder.andWhere('nft.price BETWEEN :priceMin AND :priceMax', {priceMin, priceMax});
        } else if (priceMin > 0) {
            queryBuilder.andWhere('nft.price >= :priceMin', {priceMin});
        } else if (priceMax > 0) {
            queryBuilder.andWhere('nft.price <= :priceMax', {priceMax});
        }
        // Add search filter if searchQuery is provided
        if (searchQuery && searchQuery.length > 2) {
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
