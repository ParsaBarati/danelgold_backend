import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Relation,
} from 'typeorm';
import { User } from '@/user/entity/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('tokens')
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.tokens)
  @ApiProperty({ type: () =>  User})
  user: Relation<User>;
}
