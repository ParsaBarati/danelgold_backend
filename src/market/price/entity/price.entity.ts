import { CollectionEntity } from '@/market/collection/entity/collection.entity';
import { NFT } from '@/nft/nft/entity/nft.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    Relation
  } from 'typeorm';
  
  @Entity({ name: 'prices' })
  export class PriceEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'float' })
    floorPrice: number;
  
    @Column({ type: 'float', nullable: true })
    floorChange: number;
  
    @Column({ type: 'float' })
    volume: number;
  
    @Column({ type: 'float', nullable: true })
    volumeChange: number;
  
    @Column({ type: 'varchar' })
    items: string;
  
    @Column({ type: 'int' })
    owners: number;
  
    @Column({ type: 'varchar' })
    currency: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @ManyToOne(() => CollectionEntity, (collection) => collection.priceChanges)
    @ApiProperty({ type: () => CollectionEntity })
    collection: Relation<CollectionEntity>;
  
    @ManyToOne(() => NFT, (nft) => nft.prices)
    @ApiProperty({ type: () => NFT })
    nft: Relation<NFT>;
  }
  