import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    Relation,
    UpdateDateColumn
} from 'typeorm';
import {ApiProperty} from '@nestjs/swagger';
import {Token} from '@/User/auth/token/entity/token.entity';
import {UserDetail} from '@/User/user-detail/entity/userDetail.entity';
import {Subscribe} from '@/User/subscribe/entity/subscribe.entity';
import {CollectionEntity} from '@/Market/collection/entity/collection.entity';
import {Auction} from '@/Market/auction/entity/auction.entity';
import {Bid} from '@/Market/auction/entity/auctionBid.entity';
import {SupportTicket} from '@/Social/Support-Ticket/ST/entity/support-ticket.entity';
import {ForumTopic} from '@/Social/forum/entity/forum-topic.entity';
import {ForumPost} from '@/Social/forum/entity/forum-post.entity';
import {Story} from '@/Social/Story/stories/entity/stories.entity';
import {Comment} from '@/Social/Comment/comment/entity/comment.entity';
import {NFT} from '@/NFT/nft/entity/nft.entity';
import {likeComment} from '@/Social/Comment/like-comment/entity/like-comment.entity';
import {Post} from '@/Social/Post/posts/entity/posts.entity';
import {likePost} from '@/Social/Post/like-post/entity/like-post.entity';
import {Reply} from '@/Social/Comment/replyComment/entity/reply.entity';
import {likeStory} from '@/Social/Story/like-story/entity/like-story.entity';
import {Club} from '@/Social/Club/entity/club.entity';
import {Message} from '@/Social/Message/entity/message.entity';
import {Notification} from '@/Social/Notification/entity/notification.entity';
import {Wallet} from '@/NFT/wallet/entity/wallet.entity';
import {FollowUser} from '@/Social/Follow/entity/follow.entity';
import {savePost} from "@/Social/Post/save-post/entity/save-post.entity";
import {CryptoBalanceEntity} from "@/NFT/Crypto/entity/cryptoBalance.entity";

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
}

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

    @OneToMany(() => Token, (token) => token.user)
    @ApiProperty({type: () => [Token]})
    tokens: Relation<Token[]>;

    @OneToMany(() => Subscribe, (subscribes) => subscribes.user)
    @ApiProperty({type: () => [Subscribe]})
    subscribes: Relation<Subscribe[]>;

    @OneToMany(() => CollectionEntity, (collectionEntities) => collectionEntities.creator)
    @ApiProperty({type: () => [CollectionEntity]})
    collectionEntities: Relation<CollectionEntity[]>;

    @OneToMany(() => NFT, (nfts) => nfts.creator)
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

    @ManyToMany(() => Club, (clubs) => clubs.members)
    @ApiProperty({type: () => Club})
    clubs: Relation<Club>;

}
