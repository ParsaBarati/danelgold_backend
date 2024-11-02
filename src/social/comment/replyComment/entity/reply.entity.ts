import { ApiProperty } from '@nestjs/swagger';
import { Comment } from '@/social/comment/comment/entity/comment.entity';
import { User } from '@/user/user/entity/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Relation,
} from 'typeorm';

@Entity('replies')
export class Reply {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamptz',
    onUpdate: 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  updatedAt: Date | null;

  @Column({ type: 'int', nullable: true })
  parentCommentId: number | null;

  @Column({ type: 'int', nullable: true })
  parentReplyId: number | null;

  @ManyToOne(() => User, (user) => user.replies)
  @ApiProperty({ type: () => User })
  user: Relation<User>;

  @ManyToOne(() => Comment, (comment) => comment.replies)
  @JoinColumn({ name: 'parentCommentId', referencedColumnName: 'id' })
  @ApiProperty({ type: () => Comment })
  parentComment: Relation<Comment>;

  @ManyToOne(() => Reply, (reply) => reply.replies)
  @JoinColumn({ name: 'parentReplyId', referencedColumnName: 'id' })
  @ApiProperty({ type: () => Reply })
  parentReply: Relation<Reply>;

  @OneToMany(() => Reply, (reply) => reply.parentReply)
  @ApiProperty({ type: () => [Reply] })
  replies: Relation<Reply[]>;
}
