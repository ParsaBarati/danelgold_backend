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

@Column({ type: 'int', default: 0 })
shares: number; // New field for shares

@Column({ type: 'boolean', default: false })
isSaved: boolean; // New field for isSaved

@Column({ type: 'boolean', default: false })
isLiked: boolean; // New field for isLiked

@Column({ type: 'boolean', default: false })
isDisliked: boolean; // New field for isDisliked

@Column({ type: 'text', nullable: true })
qrLink: string; // New field for QR link

@Column({ type: 'text', nullable: true })
buyLink: string; // New field for Buy link

@Column({ type: 'varchar', nullable: true })
likedBy: string; // New field for likedBy, assuming it stores a username

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
@JoinColumn({ name: 'userPhone', referencedColumnName: 'phone' })
@ApiProperty({ type: () => User })
user: Relation<User>;
}
