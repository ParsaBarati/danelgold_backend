import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Relation } from 'typeorm';
import { User } from '@/User/user/entity/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('cryptos')
export class CryptoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string; 

  @Column({ type: 'varchar' })
  logo: string;

  @Column({ type: 'decimal', precision: 18, scale: 8 })
  balance: number;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  price: number; 

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.cryptos)
  @ApiProperty({ type: () => User })
  user: Relation<User>;
}
