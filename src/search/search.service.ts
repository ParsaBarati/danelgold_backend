import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/User/user/entity/user.entity';
import { CollectionEntity } from '@/Market/collection/entity/collection.entity';
import { Like } from 'typeorm';
import { NFT } from '@/NFT/nft/entity/nft.entity';
import { Post } from '@/Social/Post/posts/entity/posts.entity';
import { NotificationService } from '@/Social/Notification/notification.service';
import { NotificationAction } from '@/Social/Notification/entity/notification.entity';

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
    private readonly notificationService: NotificationService
  ) {}

  async search(query: string, user: User): Promise<any> {
    const searchQuery = `%${query}%`;

    const collections = await this.collectionRepository.find({
        where: [{ name: Like(searchQuery) }],
        select: ['id', 'name', 'cover'],
    });

    const users = await this.userRepository.find({
        where: [{ username: Like(searchQuery) }],
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

    // Extract tags (mentions) from post captions
    const mentionedUsers: Set<number> = new Set();
    const tags = posts
        .map((post) => {
            const words = post.caption?.split(' ') || [];
            // Check for mentions (assuming mentions are in the format @username)
            words.forEach(word => {
                if (word.startsWith('@')) {
                    const username = word.substring(1); // Remove '@'
                    const mentionedUser = users.find(user => user.username === username);
                    if (mentionedUser) {
                        mentionedUsers.add(mentionedUser.id); // Collect mentioned user IDs
                    }
                }
            });
            return words.filter((word) => word.startsWith('#')); // Extract hashtags
        })
        .flat()
        .filter((tag) => tag);

    // Send notifications to mentioned users
    for (const userId of mentionedUsers) {
        if (userId !== user.id) { // Avoid notifying the user themselves
            const mentionedUser = users.find(user => user.id === userId);
            if (mentionedUser) {
                await this.notificationService.sendNotification(
                    userId, // Recipient: mentioned user
                    NotificationAction.MENTION, // Action type: can be POST for mentions
                    `You were mentioned in a post by ${user.id}`, // Notification title
                    '', // Thumbnail can be empty or you can add the mentioner’s profile pic
                    user.id // Sender: current user ID
                );
            }
        }
    }

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
