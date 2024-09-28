import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  CreateDateColumn, 
  UpdateDateColumn, 
  Relation, 
  OneToMany,
  JoinColumn,
  Index
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@/User/user/entity/user.entity';
import { CollectionEntity } from '@/Market/collection/entity/collection.entity';
import { Auction } from '@/Market/auction/entity/auction.entity';

@Entity({ name: 'nfts'})
export class NFT {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({type: 'varchar'})
  imageURL: string;

  @Column({ unique: true })
  @Index({ unique: true })
  metadataURL: string;

  @Column({ type: 'varchar' })
  ownerPhone: string;

  @Column({ type: 'varchar' })
  creatorPhone: string;

  @Column('decimal', { precision: 18, scale: 8, nullable: false }) 
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date;

  @OneToMany(() => Auction, (auctions) => auctions.nft)
  @ApiProperty({ type: () => [Auction] })
  auctions: Relation<Auction[]>;

  @ManyToOne(() => CollectionEntity, (collectionEntity) => collectionEntity.nfts)
  @ApiProperty({ type: () => CollectionEntity })
  collectionEntity: Relation<CollectionEntity>;

  @ManyToOne(() => User, (creator) => creator.createdNfts)
  @JoinColumn({ name: 'creatorPhone', referencedColumnName: 'phone' })
  @ApiProperty({ type: () => User })
  creator: Relation<User>;

  @ManyToOne(() => User, (owner) => owner.ownedNfts)
  @JoinColumn({ name: 'ownerPhone', referencedColumnName: 'phone' })
  @ApiProperty({ type: () => User })
  owner: Relation<User>;
}
