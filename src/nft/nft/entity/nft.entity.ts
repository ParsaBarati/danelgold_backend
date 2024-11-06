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
import { PriceEntity } from '@/market/price/entity/price.entity';
import { MarketplaceEntity } from '@/market/market-place/entity/market-place.entity';
import {savePost} from "@/social/post/save-post/entity/save-post.entity";
import {FavoritesEntity} from "@/nft/favorites/entity/favorites.entity";

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

  @Column()
  collectionId: number;

  @Column('decimal', { precision: 18, scale: 8, nullable: false }) 
  price: number;

  @Column({type: 'int', default: 0})
  favorites: number;
  @Column({type: 'int', default: 0})
  views: number;


  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date;

  @OneToMany(() => Auction, (auctions) => auctions.items)
  @ApiProperty({ type: () => [Auction] })
  auctions: Relation<Auction[]>;

  @OneToMany(() => PriceEntity, (prices) => prices.nft)
  @ApiProperty({ type: () => [PriceEntity] })
  prices: Relation<PriceEntity[]>;

  @ManyToOne(() => CollectionEntity, (collectionEntity) => collectionEntity.nfts)
  @JoinColumn({ name: 'collectionId', referencedColumnName: 'id' })
  @ApiProperty({ type: () => CollectionEntity })
  collectionEntity: Relation<CollectionEntity>;

  @ManyToOne(() => User, (artist) => artist.createdNfts) // Assuming the artist is a User
  @ApiProperty({ type: () => User }) // Specify the API property
  artist: Relation<User>; // Ensure artist is linked correctly

  @ManyToOne(() => MarketplaceEntity, (marketplace) => marketplace.nfts)
  @ApiProperty({ type: () => MarketplaceEntity })
  marketplace: Relation<MarketplaceEntity>;

  @ManyToOne(() => User, (owner) => owner.ownedNfts)
  @ApiProperty({ type: () => User })
  owner: Relation<User>;

  @OneToMany(() => FavoritesEntity, nftSaves => nftSaves.nft)
  @ApiProperty({type: () => [FavoritesEntity]})
  nftFavorites: Relation<FavoritesEntity[]>;
}
