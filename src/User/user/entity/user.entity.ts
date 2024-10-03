import { Entity, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Relation, Generated, PrimaryColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Token } from '@/User/auth/token/entity/token.entity';
import { UserDetail } from '@/User/user-detail/entity/userDetail.entity';
import { Subscribe } from '@/User/subscribe/entity/subscribe.entity';
import { CollectionEntity } from '@/Market/collection/entity/collection.entity';
import { Auction } from '@/Market/auction/entity/auction.entity';
import { Bid } from '@/Market/auction/entity/auctionBid.entity';
import { SupportTicket } from '@/Social/Support-Ticket/ST/entity/support-ticket.entity';
import { ForumTopic } from '@/Social/forum/entity/forum-topic.entity';
import { ForumPost } from '@/Social/forum/entity/forum-post.entity';
import { Story } from '@/Social/Story/stories/entity/stories.entity';
import { Comment } from '@/Social/Comment/comment/entity/comment.entity';
import { NFT } from '@/NFT/nft/entity/nft.entity';
import { likeComment } from '@/Social/Comment/like-comment/entity/like-comment.entity';
import { Post } from '@/Social/Post/posts/entity/posts.entity';
import { likePost } from '@/Social/Post/like-post/entity/like-post.entity';
import { Reply } from '@/Social/Comment/replyComment/entity/reply.entity';
import { likeStory } from '@/Social/Story/like-story/entity/like-story.entity';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity({ name: 'user'})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, length: 11 })
  phone: string;

  @Column({ type: 'varchar' })
  firstName: string;

  @Column({ type: 'varchar' })
  lastName: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'text' })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  imageUrl: string | null;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  lastLogin: Date | null;

  @OneToMany(() => Token, (token) => token.user)
  @ApiProperty({ type: () => [Token] })
  tokens: Relation<Token[]>;

  @OneToMany(() => UserDetail, (userDetail) => userDetail.user)
  @ApiProperty({ type: () => [UserDetail] })
  userDetail: Relation<UserDetail[]>;

  @OneToMany(() => Subscribe, (subscribes) => subscribes.user)
  @ApiProperty({ type: () => [Subscribe] })
  subscribes: Relation<Subscribe[]>;

  @OneToMany(() => CollectionEntity, (collectionEntities) => collectionEntities.creator)
  @ApiProperty({ type: () => [CollectionEntity] })
  collectionEntities: Relation<CollectionEntity[]>;

  @OneToMany(() => NFT, (nfts) => nfts.creator)
  @ApiProperty({ type: () => [NFT] })
  createdNfts: Relation<NFT[]>;

  @OneToMany(() => NFT, (nfts) => nfts.owner)
  @ApiProperty({ type: () => [NFT]} )
  ownedNfts: Relation<NFT[]>;

  @OneToMany(() => Auction, (auctions) => auctions.creator)
  @ApiProperty({ type: () => [Auction] })
  auctions: Relation<Auction[]>;

  @OneToMany(() => Bid, bid => bid.user)
  @ApiProperty({ type: () => [Bid] })
  bids: Relation<Bid[]>;

  @OneToMany(() => (SupportTicket), tickets => tickets.user)
  @ApiProperty({ type: () => [SupportTicket] })
  supportTickets: Relation<SupportTicket[]>;

  @OneToMany(() => (ForumTopic), topics => topics.user)
  @ApiProperty({ type: () => [ForumTopic] })
  forumTopics: Relation<ForumTopic[]>;

  @OneToMany(() => (ForumPost), posts => posts.user)
  @ApiProperty({ type: () => [ForumPost] })
  forumPosts: Relation<ForumPost[]>;

  @OneToMany(() => (Story) , stories => stories.user)
  @ApiProperty({ type: () => [Story] })
  stories: Relation<Story[]>

  @OneToMany(() => (Post) , posts => posts.user)
  @ApiProperty({ type: () => [Post] })
  posts: Relation<Post[]>

  @OneToMany(() => (Comment), comments => comments.user)
  @ApiProperty({ type:() => [Comment] })
  comments: Relation<Comment[]>

  @OneToMany(() => (Reply), replies => replies.user)
  @ApiProperty({ type:() => [Reply] })
  replies: Relation<Reply[]>

  @OneToMany(() => (likeComment), commentlikes => commentlikes.user)
  @ApiProperty({ type: () => [likeComment] })
  commentlikes: Relation<likeComment[]>

  @OneToMany(() => (likePost), postLikes => postLikes.user)
  @ApiProperty({ type: () => [likePost] })
  postLikes: Relation<likePost[]>

  @OneToMany(() => (likeStory), storyLikes => storyLikes.user)
  @ApiProperty({ type: () => [likeStory] })
  storyLikes: Relation<likeStory[]>
}