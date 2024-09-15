import { Entity, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Relation, Generated, PrimaryColumn, OneToOne } from 'typeorm';
import { CollectionEntity } from '@/collection/entity/collection.entity';
import { NFT } from '@/nft/entity/nft.entity';
import { Auction } from '@/auction/entity/auction.entity';
import { SupportTicket } from '@/support-ticket/entity/support-ticket.entity';
import { ForumTopic } from '@/forum/entity/forum-topic.entity';
import { ForumPost } from '@/forum/entity/forum-post.entity';
import { Bid } from '@/auction/entity/auctionBid.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Wallet } from '@/wallet/entity/wallet.entity';
import { Token } from '@/auth/token/entity/token.entity';
import { Subscribe } from '@/subscribe/entity/subscribe.entity';
import { UserDetail } from '@/user-detail/entity/userDetail.entity';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity({ name: 'users'})
export class User {
  @Column()
  @Generated('increment')
  id: number;

  @PrimaryColumn({ type: 'varchar', unique: true, length: 11 })
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

  @Column({ nullable: true })
  walletAddress: string;

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

  @OneToOne(() => Wallet, (wallets) => wallets.user)
  @ApiProperty({ type: () => Wallet })
  wallets: Relation<Wallet>;

  @OneToMany(() => UserDetail, (userDetail) => userDetail.user)
  @ApiProperty({ type: () => [UserDetail] })
  userDetail: Relation<UserDetail[]>;

  @OneToMany(() => Subscribe, (subscribes) => subscribes.user)
  @ApiProperty({ type: () => [Subscribe] })
  subscribes: Relation<Subscribe[]>;

  @OneToMany(() => CollectionEntity, (collectionEntities) => collectionEntities.creator)
  collectionEntities: Relation<CollectionEntity[]>;

  @OneToMany(() => NFT, (nfts) => nfts.creator)
  createdNfts: Relation<NFT[]>;

  @OneToMany(() => NFT, (nfts) => nfts.owner)
  ownedNfts: NFT[];

  @OneToMany(() => Auction, (auctions) => auctions.creator)
  auctions: Relation<Auction[]>;

  @OneToMany(() => Bid, bid => bid.user)
  bids: Relation<Bid[]>;

  @OneToMany(() => (SupportTicket), tickets => tickets.user)
  supportTickets: Relation<SupportTicket[]>;

  @OneToMany(() => (ForumTopic), topics => topics.user)
  forumTopics: Relation<ForumTopic[]>;

  @OneToMany(() => (ForumPost), posts => posts.user)
  forumPosts: Relation<ForumPost[]>;
}