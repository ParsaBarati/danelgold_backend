import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToOne, 
    OneToMany, 
    CreateDateColumn, 
    UpdateDateColumn, 
    Relation,
    JoinColumn
} from 'typeorm';
import { User } from '@/User/user/entity/user.entity';
import { Comment } from '@/Social/Comment/comment/entity/comment.entity';
import { ApiProperty } from '@nestjs/swagger';
import { likePost } from '@/Social/Post/like-post/entity/like-post.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  userPhone: string;

  @Column({ type: 'text' })
  mediaUrl: string;

  @Column({ type: 'text', nullable: true })
  caption: string;

  @Column({ type: 'int', default: 0 })
  likes: number;

  @Column({ type: 'int', default: 0 })
  dislikes: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Comment, comments => comments.post, { cascade: true })
  @ApiProperty({ type: () => [Comment] })
  comments: Relation<Comment[]>;

  @OneToMany(() => likePost, postLikes => postLikes.post)
  @ApiProperty({ type: () => [likePost] })
  postLikes: Relation<likePost[]>;

  @ManyToOne(() => User, user => user.posts)
  @JoinColumn({ name: 'userPhone',referencedColumnName: 'phone'})
  @ApiProperty({ type: () => User })
  user: Relation<User>;
}
