import { NFT } from '@/nft/nft/entity/nft.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Relation,
} from 'typeorm';

@Entity({ name: 'marketplaces' })
export class MarketplaceEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    icon: string;

    @Column('decimal', { precision: 18, scale: 8, nullable: true }) // Adjust precision and scale as necessary
    floorPrice: number;

    @Column({ type: 'varchar', nullable: true }) // Adjust the type based on your needs
    currency: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', nullable: true })
    updatedAt: Date;

    @OneToMany(() => NFT, (nft) => nft.marketplace, { cascade: true })
    @ApiProperty({ type: () => [NFT] })
    nfts: Relation<NFT[]>;
}
