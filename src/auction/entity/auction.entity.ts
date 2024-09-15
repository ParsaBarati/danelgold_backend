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
  @ApiProperty({ description: 'The title of the auction' })
  title: string;

  @Column({ type: 'timestamptz' })
  @ApiProperty({ description: 'The start time of the auction' })
  startTime: Date;

  @Column({ type: 'timestamptz' })
  @ApiProperty({ description: 'The end time of the auction' })
  endTime: Date;

  @Column('decimal', { precision: 18, scale: 8 })
  @ApiProperty({ description: 'The starting bid amount' })
  startingBid: number;

  @Column('decimal', { precision: 18, scale: 8 })
  @ApiProperty({ description: 'The current highest bid amount' })
  currentBid: number;

  @Column({
    type: 'enum',
    enum: AuctionStatus,
    default: AuctionStatus.Active
  })
  @ApiProperty({ description: 'The status of the auction' })
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
