import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToMany, Relation, JoinColumn } from 'typeorm';
import { User } from '@/User/user/entity/user.entity';
import { Comment } from '@/Social/Comment/comment/entity/comment.entity';
import { ApiProperty } from '@nestjs/swagger';
import { likeStory } from '../../like-story/entity/like-story.entity';

@Entity('stories')
export class Story {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  userIdentifier: string;

  @Column({ type: 'text' })
  thumbnail: string;

  @Column({ type: 'text' })
  mediaUrl: string;

  @Column({ type: 'int', default: 0 })
  likes: number;

  @Column({ type: 'int', default: 0 })
  dislikes: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @OneToMany(() => Comment, comments => comments.story)
  @ApiProperty({ type: () => [Comment] })
  comments: Relation<Comment[]>;

  @OneToMany(() => likeStory, storyLikes => storyLikes.story)
  @ApiProperty({ type: () => [likeStory] })
  storyLikes: Relation<likeStory[]>;

  @ManyToOne(() => User, user => user.stories)
  user: Relation<User>;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'story_viewers',
    joinColumn: { name: 'storyId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'viewerId', referencedColumnName: 'id' },
  })
  viewers: Relation<User[]>;
}
