import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Relation } from 'typeorm';
import { Wallet } from '@/wallet/entity/wallet.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name:'wallet_transactions'}) 
export class walletTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  transaction: string;

  @Column()
  amount: number;

  @Column({ nullable: true })
  orderId: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => Wallet, (wallet) => wallet.walletTransactions)
  @ApiProperty({ type: () => Wallet })
  wallet: Relation<Wallet>;
}
