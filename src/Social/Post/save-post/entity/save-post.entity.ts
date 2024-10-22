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
  
  @Entity({ name: 'postSaves' })
  export class savePost {
    @PrimaryGeneratedColumn()
    id: number;

  
    @Column({ type: 'int'})
    postId: number;

    @Column({ type: 'int'})
    userId: number;
  
    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;
  
    @ManyToOne(() => Post, (post) => post.postSaves)
    @JoinColumn({ name: 'postId', referencedColumnName: 'id' })
    @ApiProperty({ type: () => Post })
    post: Relation<Post>;
  
    @ManyToOne(() => User, (user) => user.postSaves)
    @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
    @ApiProperty({ type: () => User })
    user: Relation<User>;
  }
  