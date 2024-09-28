import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToMany, Relation, JoinColumn } from 'typeorm';
import { User } from '@/User/user/entity/user.entity';
import { Comment } from '@/Social/Comment/comment/entity/comment.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('stories')
export class Story {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'varchar' })
  userPhone: string;

  @Column({ type: 'text' })
  mediaUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: false })
  expiresAt: Date;

  @Column({ default: false })
  isArchived: boolean;

  @Column({ default: true })
  isPublic: boolean;

  @OneToMany(() => Comment, comments => comments.story)
  @ApiProperty({ type: () => [Comment] })
  comments: Relation<Comment[]>

  @ManyToOne(() => User, user => user.stories)
  @JoinColumn({ name: 'userPhone',referencedColumnName: 'phone'})
  user: Relation<User>;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'story_viewers',
    joinColumn: { name: 'storyId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'viewerId', referencedColumnName: 'id' }
  })
  viewers: Relation<User[]>;

}
