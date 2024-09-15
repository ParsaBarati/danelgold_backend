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
import { CollectionEntity } from '@/collection/entity/collection.entity';
import { Auction } from '@/auction/entity/auction.entity';
import { User } from '@/user/entity/user.entity';

@Entity({ name: 'nfts'})
export class NFT {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({type: 'text',nullable: true})
  description: string;

  @Column()
  imageURL: string;

  @Column()
  metadataURL: string;

  @Column()
  ownerPhone: string;

  @Column()
  creatorPhone: string;

  @Column('decimal', { precision: 18, scale: 8 })
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({type: 'timestamp', nullable: true})
  updatedAt: Date;

  @OneToMany(() => Auction, (auctions) => auctions.nft)
  auctions: Relation<NFT[]>

  @ManyToOne(() => CollectionEntity, (collectionEntity) => collectionEntity.nfts)
  collectionEntity: Relation<CollectionEntity>;

  @ManyToOne(() => User, (creator) => creator.createdNfts)
  @JoinColumn({ name: 'creatorPhone',referencedColumnName: 'phone' })
  creator: Relation<User>;

  @ManyToOne(() => User, (owner) => owner.ownedNfts)
  @JoinColumn({ name: 'ownerPhone',referencedColumnName: 'phone' })
  owner: Relation<User>;
}
