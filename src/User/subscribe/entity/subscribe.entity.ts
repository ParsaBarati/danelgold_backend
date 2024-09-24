import { ApiProperty } from '@nestjs/swagger';
import { User } from '@/user/entity/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Relation,
} from 'typeorm';

@Entity('subscribe')
export class Subscribe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  endpoint: string;

  @Column({ type: 'varchar' })
  auth: string;

  @Column({ type: 'varchar' })
  p256dh: string;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  userPhone: string | null;

  @ManyToOne(() => User, (user) => user.subscribes, { cascade: true })
  @JoinColumn({ name: 'userPhone', referencedColumnName: 'phone' })
  @ApiProperty({ type: () => User })
  user: Relation<User>;
}
