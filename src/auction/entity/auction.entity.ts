import { ApiProperty } from '@nestjs/swagger';
import { NFT } from '@/nft/entity/nft.entity';
import { User } from '@/user/entity/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Relation, OneToMany, JoinColumn } from 'typeorm';
import { Bid } from './auctionBid.entity';

export enum AuctionStatus {
  Active = 'active',
  Deactive = 'deactive'
}

@Entity({ name: 'auctions' })
export class Auction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'timestamptz' })
  startTime: Date;

  @Column({ type: 'timestamptz' })
  endTime: Date;

  @Column('decimal', { precision: 18, scale: 8 })
  startingBid: number;

  @Column('decimal', { precision: 18, scale: 8 })
  currentBid: number;

  @ApiProperty({ enum: AuctionStatus })
  @Column('enum', {
    enum: AuctionStatus,
    default: AuctionStatus.Active
  })
  auctionStatus: AuctionStatus;

  @Column({ type: 'boolean', default: false, nullable: true })
  isSms: boolean | null;

  @CreateDateColumn({ type: 'timestamptz' })
  @ApiProperty({ description: 'The creation timestamp of the auction' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', nullable: true })
  @ApiProperty({ description: 'The last update timestamp of the auction' })
  updatedAt: Date;

  @ManyToOne(() => NFT, (nft) => nft.auctions)
  @ApiProperty({ type: () => NFT })
  nft: Relation<NFT>;

  @ManyToOne(() => User, (creator) => creator.auctions)
  @ApiProperty({ type: () => User })
  creator: Relation<User>;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'highestBidderPhone', referencedColumnName: 'phone' })
  @ApiProperty({ type: () => User, description: 'The user who placed the highest bid' })
  highestBidder: Relation<User>;

  @OneToMany(() => Bid, (bid) => bid.auction)
  @ApiProperty({ type: () => [Bid] })
  bids: Relation<Bid[]>;
}
