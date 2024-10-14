import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, Relation } from 'typeorm';
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
  
}
