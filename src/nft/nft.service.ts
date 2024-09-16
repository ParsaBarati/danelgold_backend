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
    mintNFTDto: MintNFTDto,
    creatorPhone: string
  ): Promise<ApiResponses<NFT>> {
    const { name, description, imageURL, price } = mintNFTDto;
  
    const metadata = {
      name,
      description,
      image: imageURL,
      price,
    };

    const creator = await this.userRepository.findOne({
      where: { phone: creatorPhone },
    });
  
    if (!creator) {
      throw new NotFoundException('کاربر یافت نشد');
    }
  
    const metadataURL = await this.ipfsService.uploadMetadataToIPFS(metadata);
  
    const nft = {
      name,
      description,
      imageURL,
      metadataURL,
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
    currentOwnerPhone: string,
    currentUserRoles: string[]
  ): Promise<{ message: string }> {
  
    const nft = await this.nftsRepository.findOne({
      where: { id: nftId },
      relations: ['owner'],
    });
  
    if (!nft) {
      throw new NotFoundException('NFT یافت نشد');
    }
  
    const isOwner = nft.ownerPhone === currentOwnerPhone;
    const isAdmin = currentUserRoles.includes(UserRole.ADMIN);
  
    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('فقط مالک می‌تواند این NFT را بسوزاند'); 
    }
  
    await this.nftsRepository.remove(nft);
  
    return { message: 'NFT با موفقیت سوزانده شد' }; 
  }
  

  async getNFTById(
    nftId: number
  ): Promise<ApiResponses<any>> {

    const nft = await this.nftsRepository.findOne({
      where:{ id:nftId },
      relations:['collections']
    })

    if(!nft){
      throw new NotFoundException('NFT یافت نشد')
    }

    const existingNFT = await this.nftsRepository
      .createQueryBuilder('nfts')
      .leftJoinAndSelect('nfts.creator','creator')
      .leftJoinAndSelect('nfts.owner','owner')
      .leftJoinAndSelect('nfts.collections','collection')
      .select([
        'nft.id',
        'nft.name',
        'nft.description',
        'nft.imageURL',
        'nft.matadataUrl',
        'nft.price',
        'nft.createdAt',
        'nft.updatedAt'
      ])
      .addSelect([
        'creator.firstName',
        'creator.lastName'
      ])
      .addSelect([
        'owner.firstName',
        'owner.lastName'
      ])
      .addSelect([
        'collection.id',
        'collection.name',
        'collection.description',
      ])
      .where('nfts.id = :nftId', {nftId})

      return createResponse(200,existingNFT)
  }

}
