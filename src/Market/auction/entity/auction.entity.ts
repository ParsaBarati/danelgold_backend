import { ApiProperty } from '@nestjs/swagger';
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  CreateDateColumn, 
  UpdateDateColumn, 
  Relation, 
  OneToMany, 
  JoinColumn 
} from 'typeorm';
import { User } from '@/user/user/entity/user.entity';
import { NFT } from '@/nft/nft/entity/nft.entity';
import { Bid } from '@/market/auction/entity/auctionBid.entity';

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

  @Column('enum', {
    enum: AuctionStatus,
    default: AuctionStatus.Active
  })
  auctionStatus: AuctionStatus;

  @Column({ type: 'boolean', default: false, nullable: true })
  isSms: boolean | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', nullable: true })
  updatedAt: Date;

  @OneToMany(() => Bid, (bid) => bid.auction)
  @ApiProperty({ type: () => [Bid] })
  bids: Relation<Bid[]>;

  @ManyToOne(() => NFT, (nft) => nft.auctions)
  @ApiProperty({ type: () => NFT })
  nft: Relation<NFT>;

  @ManyToOne(() => User, (creator) => creator.auctions)
  @ApiProperty({ type: () => User })
  creator: Relation<User>;

  @ManyToOne(() => User, (highestBidder) => highestBidder.auctions)
  @ApiProperty({ type: () => User })
  highestBidder: Relation<User>;

}
