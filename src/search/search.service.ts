import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/User/user/entity/user.entity';
import { CollectionEntity } from '@/Market/collection/entity/collection.entity';
import { Like } from 'typeorm';
import { NFT } from '@/NFT/nft/entity/nft.entity';
import { Post } from '@/Social/Post/posts/entity/posts.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(CollectionEntity)
    private readonly collectionRepository: Repository<CollectionEntity>,
    @InjectRepository(NFT)
    private readonly nftRepository: Repository<NFT>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async search(query: string): Promise<any> {
    const searchQuery = `%${query}%`;

    const collections = await this.collectionRepository.find({
      where: [
        { name: Like(searchQuery) },
        // You can add more fields to search in the Collection entity if needed
      ],
      select: ['id', 'name', 'cover'], // Only select the relevant fields
    });

    const users = await this.userRepository.find({
      where: [
        { username: Like(searchQuery) },
      ],
      select: ['id', 'username', 'profilePic'], // Select relevant fields
    });

    const nfts = await this.nftRepository.find({
      where: { name: Like(searchQuery) },
      select: ['id', 'name', 'image'], // Select relevant fields
    });

    const posts = await this.postRepository.find({
      where: { caption: Like(searchQuery) },
      select: ['id', 'caption'], // Only select the relevant fields
    });

    // Extract tags from post captions (if any)
    const tags = posts
      .map((post) => post.caption?.split(' ')?.filter((word) => word.startsWith('#')))
      .flat()
      .filter((tag) => tag);

    // Return the results
    return {
      results: {
        type: 'Collections',
        data: collections.map((collection) => ({
          id: collection.id,
          cover: collection.cover,
          name: collection.name,
        })),
      },
      users: {
        type: 'Users',
        data: users.map((user) => ({
          id: user.id,
          username: user.username,
          pic: user.profilePic,
        })),
      },
      nfts: {
        type: 'NFTs',
        data: nfts.map((nft) => ({
          id: nft.id,
          thumb: nft.image,
          name: nft.name,
        })),
      },
      tags: {
        type: 'Tags',
        data: [...new Set(tags)], 
      },
    };
  }
}
