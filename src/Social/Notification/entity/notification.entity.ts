import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, Relation } from 'typeorm';
import { User } from '@/User/user/entity/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum NotificationAction {
  FOLLOW = 'follow',
  UNFOLLOW = 'unfollow',
  POST = 'post',
  COMMENT = 'comment',
  LIKE = 'like',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  thumb: string; 

  @Column({
    type: 'enum',
    enum: NotificationAction,
  })
  action: NotificationAction; 

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.sentNotifications)
  @ApiProperty({ type: () => User })
  user: Relation<User>; 

  @ManyToOne(() => User, (user) => user.receivedNotifications)
  @ApiProperty({ type: () => User })
  recipient: Relation<User>; 
}

