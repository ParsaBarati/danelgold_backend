import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    Relation,
  } from 'typeorm';
  import { ApiProperty } from '@nestjs/swagger';
  import { User } from '@/user/user/entity/user.entity';
  import { Post } from '@/social/post/posts/entity/posts.entity';
import { Message } from '@/social/message/message/entity/message.entity';
  
  @Entity({ name: 'messageLikes' })
  export class likeMessage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int', nullable: true, default: 0 })
    isLike: number;

    @Column({ type: 'int'})
    messsageId: number;

    @Column({ type: 'int'})
    userId: number;
  
    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;
  
    @ManyToOne(() => Message, (message) => message.messagelikes)
    @JoinColumn({ name: 'messageId', referencedColumnName: 'id' })
    @ApiProperty({ type: () => Message })
    message: Relation<Message>;
  
    @ManyToOne(() => User, (user) => user.postSaves)
    @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
    @ApiProperty({ type: () => User })
    user: Relation<User>;
  }
  