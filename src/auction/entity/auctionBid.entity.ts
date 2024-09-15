import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Relation, JoinColumn } from 'typeorm';
import { Auction } from './auction.entity';
import { User } from '@/user/entity/user.entity';

@Entity({ name: 'bids' })
export class Bid {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 18, scale: 8 })
  @ApiProperty({ description: 'The amount of the bid' })
  amount: number;

  @CreateDateColumn({ type: 'timestamptz' })
  @ApiProperty({ description: 'The timestamp when the bid was placed' })
  createdAt: Date;

  @ManyToOne(() => Auction, (auction) => auction.bids)
  @JoinColumn({ name: 'auctionId', referencedColumnName: 'id' })
  @ApiProperty({ type: () => Auction })
  auction: Relation<Auction>;

  @ManyToOne(() => User, (user) => user.bids)
  @JoinColumn({ name: 'userPhone', referencedColumnName: 'phone' })
  @ApiProperty({ type: () => User })
  user: Relation<User>;
}
