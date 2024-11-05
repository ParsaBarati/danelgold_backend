import { Auction } from '@/market/auction/entity/auction.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('slider')
export class SliderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Auction, { nullable: true })
  @ApiProperty({ type: () => Auction })
  auction: Auction;

  @Column({ nullable: true })
  link: string;

  @Column()
  imagePath: string;
}
