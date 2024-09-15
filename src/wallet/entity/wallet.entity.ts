import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionEntity } from '@/transaction/entity/transaction.entity';
import { ApiProperty } from '@nestjs/swagger';
import { walletTransaction } from './walletTransaction.entity';
import { User } from '@/user/entity/user.entity';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default: 0 })
  balance: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz',nullable: true })
  updatedAt: Date | null;

  @Column({ type: 'varchar', length: 11 })
  userPhone: string;

  @OneToOne(() => User, (user) => user.wallets)
  @JoinColumn({ name: 'userPhone', referencedColumnName: 'phone' })
  @ApiProperty({ type: () => User })
  user: Relation<User>;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.wallet)
  @ApiProperty({ type: () => [TransactionEntity] })
  transactions: Relation<TransactionEntity[]>;

  @OneToMany(() => walletTransaction, (walletTransactions) => walletTransactions.wallet)
  @ApiProperty({ type: () => [walletTransaction] })
  walletTransactions: Relation<walletTransaction[]>;
}
