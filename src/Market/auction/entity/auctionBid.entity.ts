import { ApiProperty } from '@nestjs/swagger';
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  CreateDateColumn, 
  Relation, 
  JoinColumn 
} from 'typeorm';
import { User } from '@/User/user/entity/user.entity';
import { Auction } from './auction.entity';

@Entity({ name: 'bids' })
export class Bid {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 18, scale: 8 })
  amount: number;

  @CreateDateColumn({ type: 'timestamptz' })
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
