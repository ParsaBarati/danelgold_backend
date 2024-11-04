import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/user/user/entity/user.entity';
import { IPFSService } from '@/services/IPFS.service';
import { ApiResponses, createResponse } from '@/utils/response.util';
import { NFT } from './entity/nft.entity';
import { FilterNFTsDto } from './dto/filterNFT.dto';

@Injectable()
export class NFTsService {
  constructor(
    @InjectRepository(NFT)
    private readonly nftsRepository: Repository<NFT>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly ipfsService: IPFSService
  ) {}

  async mintNFT(
    artist: string,
    name: string,
    price: number,
    image: string,
  ): Promise<ApiResponses<NFT>> {
    const creator = await this.userRepository.findOne({ where: { phone: artist } });
  
    if (!creator) {
      throw new NotFoundException('User not found');
    }
  
    const metadata = { name, image: image, price };
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
      where: { id: nftId }, relations: ['owner'] 
    });
  
    if (!nft) {
      throw new NotFoundException('NFT not found');
    }
  
    const isOwner = nft.ownerIdentifier === currentOwnerIdentifier;
  
    if (!isOwner) {
      throw new ForbiddenException('Only the owner can burn this NFT'); 
    }
  
    await this.nftsRepository.remove(nft);
    return { message: 'NFT successfully burned' }; 
  }
  
  async getNFTById(nftId: number): Promise<ApiResponses<any>> {

    const nft = await this.nftsRepository.findOne({ 
      where: { id: nftId }, 
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
      .where('nfts.id = :nftId', { nftId })
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
        days,
        searchQuery,
    } = dto;

    const queryBuilder = this.nftsRepository
        .createQueryBuilder('nft')
        .leftJoinAndSelect('nft.collectionEntity', 'collection')
        .leftJoinAndSelect('nft.creator', 'artist')
        .select([
            'nft.id AS id',
            'nft.name AS name',
            'nft.image AS icon', // Assuming you use image as the icon
            'artist.id AS artistId',
            'artist.name AS artistName',
            'collection.id AS collectionId',
            'collection.name AS collectionName',
            'collection.icon AS collectionIcon',
        ])
        .where('nft.price BETWEEN :priceMin AND :priceMax', { priceMin, priceMax })
        .andWhere('nft.blockchainId = :blockchainId', { blockchainId })
        .andWhere('nft.typeId = :typeId', { typeId })
        .andWhere('nft.currency = :currency', { currency })
        .andWhere('nft.createdAt >= NOW() - INTERVAL :days DAY', { days })
        .orderBy('nft.createdAt', 'DESC');

    // Add search filter if searchQuery is provided
    if (searchQuery) {
        queryBuilder.andWhere('nft.name ILIKE :searchQuery', {
            searchQuery: `%${searchQuery}%`,
        });
    }

    const nfts = await queryBuilder.getRawMany(); // Use getRawMany to get raw results

    return {
        nfts: nfts.map((nft) => ({
            id: nft.id,
            name: nft.name,
            icon: nft.icon,
            artist: {
                id: nft.artistId,
                name: nft.artistName,
            },
            collection: {
                id: nft.collectionId,
                name: nft.collectionName,
                icon: nft.collectionIcon,
            },
        })),
    };
  }
}
