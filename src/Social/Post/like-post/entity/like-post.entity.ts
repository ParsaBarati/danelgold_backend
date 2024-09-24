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
  import { Post } from '@/Social/Post/posts/entity/posts.entity';
  
  @Entity({ name: 'postLikes' })
  export class likePost {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'varchar' })
    userPhone: string;
  
    @Column({ type: 'int', nullable: true, default: 0 })
    isLike: number;
  
    @Column({ type: 'int'})
    postId: number;
  
    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;
  
    @ManyToOne(() => Post, (post) => post.postLikes, { cascade: true })
    @JoinColumn({ name: 'postId', referencedColumnName: 'id' })
    @ApiProperty({ type: () => Post })
    post: Relation<Post>;
  
    @ManyToOne(() => User, (user) => user.postLikes, { cascade: true })
    @JoinColumn({ name: 'userPhone', referencedColumnName: 'phone' })
    @ApiProperty({ type: () => User })
    user: Relation<User>;
  }
  