import {Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, Relation, OneToMany} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@/User/user/entity/user.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (sender) => sender.sentMessages)
  @ApiProperty({ type: () => User })
  sender: Relation<User>;

  @ManyToOne(() => User, (receiver) => receiver.receivedMessages)
  @ApiProperty({ type: () => User })
  receiver: Relation<User>;

  // For story reply (null if not a story reply)
  @Column({ type: 'int', nullable: true })
  storyId: number;

  // For post sharing (null if not a post sharing)
  @Column({ type: 'int', nullable: true })
  postId: number;

  // For message reply (null if not a message reply)
  @Column({ type: 'int', nullable: true })
  replyId: number;

  // For shared stories or posts (null if not shared)
  @Column({ type: 'boolean', default: false })
  isShared: boolean;

}
