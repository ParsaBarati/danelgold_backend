import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NFT } from '@/nft/entity/nft.entity';
import { ApiResponses, createResponse } from '@/utils/response.util';
import { MintNFTDto } from '@/nft/dto/MintNFT.dto';
import { User, UserRole } from '@/user/entity/user.entity';
import { IPFSService } from '@/services/IPFS.service';

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
    creatorPhone: string,
    name: string,
    price: number,
    imageURL: string, 
    description?: string,
  ): Promise<ApiResponses<NFT>> {
    const creator = await this.userRepository.findOne({ where: { phone: creatorPhone } });
  
    if (!creator) {
      throw new NotFoundException('User not found');
    }
  
    const metadata = { name, description, image: imageURL, price };
    const metadataURL = await this.ipfsService.uploadMetadataToIPFS(metadata);
  
    const nft = this.nftsRepository.create({
      name,
      description,
      imageURL,
      metadataURL,
      price,
      createdAt: new Date(),
      creator,
      owner: creator,
    });
  
    const newNFT = await this.nftsRepository.save(nft);
    return createResponse(201, newNFT);
  }
  
  async burnNFT(nftId: number, currentOwnerPhone: string, currentUserRoles: string[]): Promise<{ message: string }> {
    const nft = await this.nftsRepository.findOne({ where: { id: nftId }, relations: ['owner'] });
  
    if (!nft) {
      throw new NotFoundException('NFT not found');
    }
  
    const isOwner = nft.owner.phone === currentOwnerPhone;
    const isAdmin = currentUserRoles.includes(UserRole.ADMIN);
  
    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('Only the owner can burn this NFT'); 
    }
  
    await this.nftsRepository.remove(nft);
    return { message: 'NFT successfully burned' }; 
  }
  
  async getNFTById(nftId: number): Promise<ApiResponses<any>> {
    const nft = await this.nftsRepository.findOne({ where: { id: nftId }, relations: ['creator', 'owner', 'collections'] });
    
    if (!nft) {
      throw new NotFoundException('NFT not found');
    }
    
    const existingNFT = await this.nftsRepository
      .createQueryBuilder('nfts')
      .leftJoinAndSelect('nfts.creator', 'creator')
      .leftJoinAndSelect('nfts.owner', 'owner')
      .leftJoinAndSelect('nfts.collections', 'collection')
      .select([
        'nft.id', 'nft.name', 'nft.description', 'nft.imageURL', 'nft.metadataURL', 'nft.price', 'nft.createdAt', 'nft.updatedAt',
        'creator.firstName', 'creator.lastName', 'owner.firstName', 'owner.lastName',
        'collection.id', 'collection.name', 'collection.description',
      ])
      .where('nfts.id = :nftId', { nftId })
      .getOne();
      
    return createResponse(200, existingNFT);
  }
}
