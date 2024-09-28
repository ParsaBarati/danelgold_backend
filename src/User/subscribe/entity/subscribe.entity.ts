import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Relation,
} from 'typeorm';
import { User } from '@/User/user/entity/user.entity';

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

  @ManyToOne(() => User, (user) => user.subscribes, { cascade: true })
  @ApiProperty({ type: () => User })
  user: Relation<User>;
}
