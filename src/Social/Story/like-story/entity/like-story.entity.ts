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
  import { Story } from '../../stories/entity/stories.entity';
  
  @Entity({ name: 'storyLikes' })
  export class likeStory {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'int', nullable: true, default: 0 })
    isLike: number;
  
    @Column({ type: 'int'})
    storyId: number;
  
    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;
  
    @ManyToOne(() => Story, (story) => story.storyLikes)
    @JoinColumn({ name: 'storyId', referencedColumnName: 'id' })
    @ApiProperty({ type: () => Story })
    story: Relation<Story>;
  
    @ManyToOne(() => User, (user) => user.storyLikes)
    @ApiProperty({ type: () => User })
    user: Relation<User>;
  }
  