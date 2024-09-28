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
import { User } from '@/User/user/entity/user.entity';
import { NFT } from '@/NFT/nft/entity/nft.entity';

@Entity({ name: 'collections' })
export class CollectionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({type: 'text', nullable: true})
  description: string;

  @Column({ type: 'varchar' })
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
