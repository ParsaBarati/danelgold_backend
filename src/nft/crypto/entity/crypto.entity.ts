import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Relation, OneToMany} from 'typeorm';
import { User } from '@/user/user/entity/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import {CryptoBalanceEntity} from "@/nft/crypto/entity/cryptoBalance.entity";

@Entity('cryptos')
export class CryptoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string; 

  @Column({ type: 'varchar' })
  logo: string;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  price: number; 

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => CryptoBalanceEntity, (crypto) => crypto.crypto)
  @ApiProperty({ type: () => CryptoBalanceEntity })
  balances: Relation<CryptoBalanceEntity>;
}
