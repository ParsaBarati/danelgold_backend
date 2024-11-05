import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    Relation,
    UpdateDateColumn
} from 'typeorm';
import {ApiProperty} from '@nestjs/swagger';
import {Token} from '@/user/auth/token/entity/token.entity';
import {UserDetail} from '@/user/user-detail/entity/userDetail.entity';
import {Subscribe} from '@/user/subscribe/entity/subscribe.entity';
import {CollectionEntity} from '@/market/collection/entity/collection.entity';
import {Auction} from '@/market/auction/entity/auction.entity';
import {SupportTicket} from '@/social/support-ticket/st/entity/support-ticket.entity';
import {ForumTopic} from '@/social/forum/entity/forum-topic.entity';
import {Story} from '@/social/story/stories/entity/stories.entity';
import {Comment} from '@/social/comment/comment/entity/comment.entity';
import {NFT} from '@/nft/nft/entity/nft.entity';
import {likeComment} from '@/social/comment/like-comment/entity/like-comment.entity';
import {Post} from '@/social/post/posts/entity/posts.entity';
import {likePost} from '@/social/post/like-post/entity/like-post.entity';
import {Reply} from '@/social/comment/replyComment/entity/reply.entity';
import {likeStory} from '@/social/story/like-story/entity/like-story.entity';
import {Club} from '@/social/club/entity/club.entity';
import {Notification} from '@/social/notification/entity/notification.entity';
import {Wallet} from '@/nft/wallet/entity/wallet.entity';
import {FollowUser} from '@/social/follow/entity/follow.entity';
import {savePost} from "@/social/post/save-post/entity/save-post.entity";
import {CryptoBalanceEntity} from "@/nft/crypto/entity/cryptoBalance.entity";
import { Message } from '@/social/message/message/entity/message.entity';
import { BlockUser } from '@/social/block/entity/block.entity';
import { Bid } from '@/market/auction/entity/auctionBid.entity';
import { ForumPost } from '@/social/forum/entity/forum-post.entity';
import { BlogPost } from '@/social/blog/blog-post/entity/blog-post.entity';


@Entity({name: 'user'})
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', nullable: true})
    name: string;

    @Column({type: 'varchar', unique: true, length: 11, nullable: true})
    phone: string | null;

    @Column({type: 'text', nullable: true})
    email: string | null;

    @Column({type: 'text', nullable: true})
    bio: string | null;

    @Column({type: 'varchar', unique: true})
    username: string;

    @Column({type: 'text'})
    password: string;

    @Column({type: 'text', nullable: true})
    firebaseToken: string;

    @Column({type: 'boolean', default: false})
    isVerified: boolean; // New field to mark user verification status

    @Column({type: 'text', nullable: true})
    profilePic: string | null;
    @Column({type: 'text', nullable: true})
    cover: string | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn({nullable: true})
    updatedAt: Date | null;

    @Column({type: 'timestamptz', nullable: true})
    lastLogin: Date | null;

    @OneToOne(() => UserDetail, (userDetail) => userDetail.user)
    @ApiProperty({type: () => UserDetail})
    userDetail: Relation<UserDetail>;

    @OneToMany(() => FollowUser, (followUser) => followUser.follower)
    @ApiProperty({type: () => [FollowUser]})
    followers: Relation<FollowUser[]>;

    @OneToMany(() => FollowUser, (followUser) => followUser.following)
    @ApiProperty({type: () => [FollowUser]})
    following: Relation<FollowUser[]>;

    @OneToMany(() => BlockUser, (blockUser) => blockUser.blocker)
    @ApiProperty({ type: () => [BlockUser] })
    blockedUsers: Relation<BlockUser[]>;

    @OneToMany(() => BlockUser, (blockUser) => blockUser.blocked)
    @ApiProperty({ type: () => [BlockUser] })
    blockingUsers: Relation<BlockUser[]>;

    @OneToMany(() => Token, (token) => token.user)
    @ApiProperty({type: () => [Token]})
    tokens: Relation<Token[]>;

    @OneToMany(() => Subscribe, (subscribes) => subscribes.user)
    @ApiProperty({type: () => [Subscribe]})
    subscribes: Relation<Subscribe[]>;

    @OneToMany(() => CollectionEntity, (collectionEntities) => collectionEntities.creator)
    @ApiProperty({type: () => [CollectionEntity]})
    collectionEntities: Relation<CollectionEntity[]>;

    @OneToMany(() => NFT, (nfts) => nfts.artist)
    @ApiProperty({type: () => [NFT]})
    createdNfts: Relation<NFT[]>;

    @OneToMany(() => NFT, (nfts) => nfts.owner)
    @ApiProperty({type: () => [NFT]})
    ownedNfts: Relation<NFT[]>;

    @OneToMany(() => Auction, (auctions) => auctions.creator)
    @ApiProperty({type: () => [Auction]})
    auctions: Relation<Auction[]>;

    @OneToMany(() => Bid, (bid) => bid.user)
    @ApiProperty({type: () => [Bid]})
    bids: Relation<Bid[]>;

    @OneToMany(() => SupportTicket, (tickets) => tickets.user)
    @ApiProperty({type: () => [SupportTicket]})
    supportTickets: Relation<SupportTicket[]>;

    @OneToMany(() => ForumTopic, (topics) => topics.user)
    @ApiProperty({type: () => [ForumTopic]})
    forumTopics: Relation<ForumTopic[]>;

    @OneToMany(() => ForumPost, (posts) => posts.user)
    @ApiProperty({type: () => [ForumPost]})
    forumPosts: Relation<ForumPost[]>;

    @OneToMany(() => Story, (stories) => stories.user)
    @ApiProperty({type: () => [Story]})
    stories: Relation<Story[]>;

    @OneToMany(() => Post, (posts) => posts.user)
    @ApiProperty({type: () => [Post]})
    posts: Relation<Post[]>;

    @OneToMany(() => Comment, (comments) => comments.user)
    @ApiProperty({type: () => [Comment]})
    comments: Relation<Comment[]>;

    @OneToMany(() => Reply, (replies) => replies.user)
    @ApiProperty({type: () => [Reply]})
    replies: Relation<Reply[]>;

    @OneToMany(() => likeComment, (commentLikes) => commentLikes.user)
    @ApiProperty({type: () => [likeComment]})
    commentLikes: Relation<likeComment[]>;

    @OneToMany(() => likePost, (postLikes) => postLikes.user)
    @ApiProperty({type: () => [likePost]})
    postLikes: Relation<likePost[]>;

    @OneToMany(() => savePost, (postSaves) => postSaves.user)
    @ApiProperty({type: () => [savePost]})
    postSaves: Relation<savePost[]>;

    @OneToMany(() => likeStory, (storyLikes) => storyLikes.user)
    @ApiProperty({type: () => [likeStory]})
    storyLikes: Relation<likeStory[]>;

    @OneToMany(() => Message, (sentMessages) => sentMessages.sender)
    @ApiProperty({type: () => [Message]})
    sentMessages: Relation<Message[]>;

    @OneToMany(() => Message, (receivedMessages) => receivedMessages.receiver)
    @ApiProperty({type: () => [Message]})
    receivedMessages: Relation<Message[]>;

    @OneToMany(() => Notification, (sentNotifications) => sentNotifications.user)
    @ApiProperty({type: () => [Notification]})
    sentNotifications: Relation<Notification[]>;

    @OneToMany(() => Notification, (receivedNotifications) => receivedNotifications.user)
    @ApiProperty({type: () => [Notification]})
    receivedNotifications: Relation<Notification[]>;

    @OneToMany(() => Wallet, (wallets) => wallets.user)
    @ApiProperty({type: () => [Wallet]})
    wallets: Relation<Wallet[]>;

    @OneToMany(() => CryptoBalanceEntity, (cryptos) => cryptos.user)
    @ApiProperty({type: () => [CryptoBalanceEntity]})
    cryptoBalances: Relation<CryptoBalanceEntity[]>;

    @OneToMany(() => BlogPost, (blogPost) => blogPost.author)
    @ApiProperty({ type: () => [BlogPost] })
    blogPost: Relation<BlogPost[]>;

    @ManyToMany(() => Club, (clubs) => clubs.members)
    @ApiProperty({type: () => Club})
    clubs: Relation<Club>;

}
