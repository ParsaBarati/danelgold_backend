import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Relation } from 'typeorm';
import { User } from '@/user/user/entity/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string; 

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  balance: number; 

  @Column({ type: 'boolean', default: false })
  isSelected: boolean; 

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date;
  
  @ManyToOne(() => User, (user) => user.wallets)
  @ApiProperty({ type: () => User })
  user: Relation<User>; 
}
