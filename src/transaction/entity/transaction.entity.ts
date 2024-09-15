import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Wallet } from '@/wallet/entity/wallet.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum TransactionStatus {
  Success = 'success',
  Cancelled = 'cancelled',
  Pending = 'pending',
}

// export enum TransactionType {
//   Cash = 'cash',
//   Debt = 'debt',
//   Credit = 'credit'
// }

@Entity({ name: 'transactions' })
export class TransactionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 16, unique: true })
  transaction: string;

  @Column({ type: 'boolean', default: true })
  isOpen: boolean;

  @Column('enum', {
    enum: TransactionStatus,
    nullable: true,
  })
  status: TransactionStatus;

  // @Column({
  //   type: 'enum',
  //   enum: TransactionType,
  // })
  // type: TransactionType;

  @Column({ type: 'varchar', nullable: true })
  refId: string | null;

  @Column({ type: 'varchar', nullable: true })
  authority: string | null;

  // @Column({ type: 'timestamptz' })
  // expire: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column({ type: 'decimal' })
  amount: number;

  @Column({ type: 'int', nullable: true })
  orderId: number;

  @Column({ type: 'int', nullable: true })
  walletId: number;

  @Column({ type: 'int', nullable: true })
  debtDueDateId: number;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
  @JoinColumn({ name: 'walletId', referencedColumnName: 'id' })
  @ApiProperty({ type: () => Wallet })
  wallet: Relation<Wallet>;

}
