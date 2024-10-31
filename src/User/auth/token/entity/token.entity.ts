import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Relation,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@/User/user/entity/user.entity';
import { Admin } from '@/User/admin/entity/admin.entity';

@Entity('tokens')
export class Token {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  token: string;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => User, { nullable: true })
  user: User | null;

  @ManyToOne(() => Admin, { nullable: true })
  admin: Admin | null;
}
