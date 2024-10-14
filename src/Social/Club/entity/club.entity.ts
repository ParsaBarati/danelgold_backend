import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, Relation } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@/User/user/entity/user.entity';

@Entity({ name: 'clubs' })
export class Club {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  cover: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  link: string;

  @Column({ type: 'int', default: 0 })
  memberCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => User, (user) => user.phone)
  @ApiProperty({ type: () => [User] })
  members: Relation<User[]>;
}
