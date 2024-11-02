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
import { User } from '@/user/user/entity/user.entity';
import { CollectionEntity } from '@/market/collection/entity/collection.entity';
import { Auction } from '@/market/auction/entity/auction.entity';

@Entity({ name: 'nfts'})
export class NFT {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({type: 'varchar'})
  image: string;

  @Column({ type: 'text' })
  text: string;

  @Column({ unique: true })
  @Index({ unique: true })
  metadataUrl: string;

  @Column({ type: 'varchar' })
  ownerIdentifier: string;

  @Column({ type: 'varchar' })
  artist: string;

  @Column()
  collectionId: number;

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
  @JoinColumn({ name: 'collectionId', referencedColumnName: 'id' })
  @ApiProperty({ type: () => CollectionEntity })
  collectionEntity: Relation<CollectionEntity>;

  @ManyToOne(() => User, (creator) => creator.createdNfts)
  @ApiProperty({ type: () => User })
  creator: Relation<User>;

  @ManyToOne(() => User, (owner) => owner.ownedNfts)
  @ApiProperty({ type: () => User })
  owner: Relation<User>;
}
