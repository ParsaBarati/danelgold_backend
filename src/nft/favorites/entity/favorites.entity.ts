import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation,} from 'typeorm';
import {ApiProperty} from '@nestjs/swagger';
import {User} from '@/user/user/entity/user.entity';
import {NFT} from "@/nft/nft/entity/nft.entity";

@Entity({name: 'favorites'})
export class FavoritesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'int'})
    nftId: number;

    @Column({type: 'int'})
    userId: number;

    @CreateDateColumn({type: 'timestamptz'})
    createdAt: Date;

    @ManyToOne(() => NFT, (nft) => nft.nftFavorites)
    @JoinColumn({name: 'nftId', referencedColumnName: 'id'})
    @ApiProperty({type: () => NFT})
    nft: Relation<NFT>;

    @ManyToOne(() => User, (user) => [])
    @JoinColumn({name: 'userId', referencedColumnName: 'id'})
    @ApiProperty({type: () => User})
    user: Relation<User>;
}
  