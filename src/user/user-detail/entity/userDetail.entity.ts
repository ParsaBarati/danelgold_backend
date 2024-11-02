import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { User } from '@/user/user/entity/user.entity';

@Entity('user-detail')
export class UserDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', default: '0.0.0.0' })
  ip: string;

  @Column({ type: 'varchar', nullable: true })
  platform: string | null;

  @Column({ type: 'varchar', nullable: true })
  browser: string | null;

  @Column({ type: 'varchar', nullable: true })
  versionBrowser: string | null;

  @Column({ type: 'varchar', nullable: true })
  versionPlatform: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  loginDate: Date;

  @OneToOne(() => User, (user) => user.userDetail)
  @ApiProperty({ type: () => User })
  user: Relation<User>;
}
