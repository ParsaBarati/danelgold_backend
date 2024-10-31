import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/User/user/entity/user.entity';
import { NFT } from './entity/nft.entity';
import { IPFSService } from '@/services/IPFS.service';
import { ApiResponses, createResponse } from '@/utils/response.util';

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
  
    const nft = this.nftsRepository.create({
      name,
      image,
      metadataUrl,
      price,
      createdAt: new Date(),
      creator,
      owner: creator,
    });
  
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
}
