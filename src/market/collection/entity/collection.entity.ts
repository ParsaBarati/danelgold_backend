import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  OneToMany, 
  Relation, 
  ManyToOne, 
  JoinColumn 
} from 'typeorm';
import { User } from '@/user/user/entity/user.entity';
import { NFT } from '@/nft/nft/entity/nft.entity';
import { ApiProperty } from '@nestjs/swagger';
import { PriceEntity } from '@/market/price/entity/price.entity';

@Entity({ name: 'collections' })
export class CollectionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({type: 'text', nullable: true})
  text: string;

  @Column({ type: 'text', nullable: true })
  cover: string;

  @Column({ type: 'varchar' })
  creatorIdentifier: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({type: 'timestamp', nullable: true})
  updatedAt: Date;

  @OneToMany(() => NFT, (nfts) => nfts.collectionEntity)
  @ApiProperty({ type: () => NFT })
  nfts: Relation<NFT[]>;

  @OneToMany(() => PriceEntity, (priceChanges) => priceChanges.collection, { cascade: true})
  @ApiProperty({ type: () => [PriceEntity] })
  priceChanges: Relation<PriceEntity[]>;

  @ManyToOne(() => User, (creator) => creator.collectionEntities)
  @ApiProperty({ type: () => User })
  creator: Relation<User>;
}
