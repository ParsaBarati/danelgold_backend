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

@Entity('tokens')
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true})
  userIdentifier: string;

  @Column()
  token: string;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.tokens)
  @ApiProperty({ type: () =>  User})
  user: Relation<User>;
}
