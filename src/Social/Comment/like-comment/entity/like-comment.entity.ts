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
import { User } from '@/User/user/entity/user.entity';
import { Comment } from '@/Social/Comment/comment/entity/comment.entity';

@Entity({ name: 'commentLikes' })
export class likeComment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  userPhone: string;

  @Column({ type: 'int', nullable: true, default: 0 })
  isLike: number;

  @Column({ type: 'int', nullable: true })
  commentId: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => Comment, (comment) => comment.commentlikes)
  @JoinColumn({ name: 'commentId', referencedColumnName: 'id' })
  @ApiProperty({ type: () => Comment })
  comment: Relation<Comment>;

  @ManyToOne(() => User, (user) => user.commentlikes)
  @JoinColumn({ name: 'userPhone', referencedColumnName: 'phone' })
  @ApiProperty({ type: () => User })
  user: Relation<User>;
}
