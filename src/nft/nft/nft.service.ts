import {ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {User} from '@/user/user/entity/user.entity';
import {IPFSService} from '@/services/IPFS.service';
import {ApiResponses, createResponse} from '@/utils/response.util';
import {NFT} from './entity/nft.entity';
import {FilterNFTsDto} from './dto/filterNFT.dto';

@Injectable()
export class NFTsService {
    constructor(
        @InjectRepository(NFT)
        private readonly nftsRepository: Repository<NFT>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly ipfsService: IPFSService
    ) {
    }

    async mintNFT(
        artist: string,
        name: string,
        price: number,
        image: string,
    ): Promise<ApiResponses<NFT>> {
        const creator = await this.userRepository.findOne({where: {phone: artist}});

        if (!creator) {
            throw new NotFoundException('User not found');
        }

        const metadata = {name, image: image, price};
        const metadataUrl = await this.ipfsService.uploadMetadataToIPFS(metadata);

        const nft = {
            name,
            image,
            metadataUrl,
            price,
            createdAt: new Date(),
            creator,
            owner: creator,
        };

        const newNFT = await this.nftsRepository.save(nft);
        return createResponse(201, newNFT);
    }

    async burnNFT(
        nftId: number,
        currentOwnerIdentifier: string
    ): Promise<{ message: string }> {

        const nft = await this.nftsRepository.findOne({
            where: {id: nftId}, relations: ['owner']
        });

        if (!nft) {
            throw new NotFoundException('NFT not found');
        }

        const isOwner = nft.ownerIdentifier === currentOwnerIdentifier;

        if (!isOwner) {
            throw new ForbiddenException('Only the owner can burn this NFT');
        }

        await this.nftsRepository.remove(nft);
        return {message: 'NFT successfully burned'};
    }

    async getNFTById(nftId: number): Promise<ApiResponses<any>> {

        const nft = await this.nftsRepository.findOne({
            where: {id: nftId},
            relations: ['creator', 'owner', 'collections']
        });

        if (!nft) {
            throw new NotFoundException('NFT not found');
        }

        const existingNFT = await this.nftsRepository
            .createQueryBuilder('nfts')
            .leftJoinAndSelect('nfts.creator', 'creator')
            .leftJoinAndSelect('nfts.owner', 'owner')
            .leftJoinAndSelect('nfts.collections', 'collection')
            .select([
                'nft.id',
                'nft.name',
                'nft.text',
                'nft.image',
                'nft.metadataUrl',
                'nft.price',
                'nft.createdAt',
                'nft.updatedAt',
                'creator.username',
                'owner.username',
                'collection.id',
                'collection.name',
                'collection.description',
            ])
            .where('nfts.id = :nftId', {nftId})
            .getOne();

        return createResponse(200, existingNFT);
    }

    async filterNFTs(dto: FilterNFTsDto): Promise<any> {
        const {
            blockchainId,
            priceMin,
            priceMax,
            currency,
            typeId,
            days = 30,
            searchQuery,
            sortOrder,
        } = dto;

        const queryBuilder = this.nftsRepository
            .createQueryBuilder('nft')
            .leftJoinAndSelect('nft.collectionEntity', 'collection')
            .leftJoinAndSelect('nft.artist', 'artist')
            .select([
                'nft.id AS id',
                'nft.name AS name',
                'nft.image AS image',
                'nft.price AS price',
                'artist.id AS artistId',
                'artist.username AS artistName',
                'artist.profilePic AS artistProfilePic',
                'collection.id AS collectionId',
                'collection.name AS collectionName',
                'collection.cover AS collectionCover',
            ])

            .andWhere(`nft.createdAt >= NOW() - INTERVAL '${days} days'`) // Quoted interval string
        ;
        // Apply conditions only when priceMin and priceMax have values
        if (priceMin > 0 && priceMax > 0) {
            queryBuilder.andWhere('nft.price BETWEEN :priceMin AND :priceMax', {priceMin, priceMax});
        } else if (priceMin > 0) {
            queryBuilder.andWhere('nft.price >= :priceMin', {priceMin});
        } else if (priceMax > 0) {
            queryBuilder.andWhere('nft.price <= :priceMax', {priceMax});
        }
        // Add search filter if searchQuery is provided
        if (searchQuery && searchQuery.toString().length > 2) {
            queryBuilder.andWhere('(nft.name ILIKE :searchQuery OR nft.text ILIKE :searchQuery)', {
                searchQuery: `%${searchQuery}%`,
            });
        }

        const nfts = await queryBuilder.orderBy('nft.createdAt', sortOrder).getRawMany(); // Use getRawMany to get raw results

        return {
            nfts: nfts.map((nft) => ({
                id: nft.id,
                name: nft.name,
                image: nft.image,
                price: nft.price,
                artist: {
                    id: nft.artistId ?? 0,
                    name: nft.artistName ?? "Artist",
                    profilePic: nft.artistProfilePic,
                },
                collection: {
                    id: nft.collectionId ?? 0,
                    name: nft.collectionName ?? "Collection",
                    cover: nft.collectionCover ?? "",
                },
            })),
        };
    }
}
