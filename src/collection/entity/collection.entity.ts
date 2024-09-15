import { NFT } from '@/nft/entity/nft.entity';
import { User } from '@/user/entity/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Relation, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'collections' })
export class CollectionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({type: 'text', nullable: true})
  description: string;

  @Column()
  creatorPhone: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({type: 'timestamp', nullable: true})
  updatedAt: Date;

  @OneToMany(() => NFT, (nfts) => nfts.collectionEntity)
  nfts: Relation<NFT[]>;

  @ManyToOne(() => User, (creator) => creator.collectionEntities)
  @JoinColumn({ name:'creatorPhone',referencedColumnName:'phone'})
  creator: Relation<User>;
}
