import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Relation,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@/User/user/entity/user.entity';
import { Reply } from '@/Social/reply/entity/reply.entity';
import { Story } from '@/Social/stories/entity/stories.entity';
import { Post } from '@/Social/Post/posts/entity/posts.entity';
import { likeComment } from '@/Social/Comment/like-comment/entity/like-comment.entity';

@Entity({ name: 'comments' })
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userPhone: string;

  @Column({type: 'int', nullable:true })
  storyId: number;

  @Column({type: 'int', nullable:true })
  postId: number;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'int', default: 0 })
  likes: number;

  @Column({ type: 'int', default: 0 })
  dislikes: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;

  @OneToMany(() => (Reply), reply => reply.parentComment, { cascade: true })
  @ApiProperty({ type: () => [Reply]} )
  replies: Relation<Reply[]>;

  @OneToMany(() => (likeComment), commentlikes => commentlikes.comment, { cascade: true })
  @ApiProperty({ type: () => [likeComment]} )
  commentlikes: Relation<likeComment[]>;

  @ManyToOne(() => (User), user => user.comments, { cascade: true })
  @JoinColumn({ name: 'userPhone', referencedColumnName: 'phone' })
  @ApiProperty({ type: () => User })
  user: Relation<User>;

  @ManyToOne(() => (Story), story => story.comments)
  @JoinColumn({ name: 'storyId', referencedColumnName: 'id' })
  @ApiProperty({ type: () => Story })
  story: Relation<Story>;

  @ManyToOne(() => (Post), post => post.comments)
  @JoinColumn({ name: 'postId', referencedColumnName: 'id' })
  @ApiProperty({ type: () => Post })
  post: Relation<Post>;
}
