import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn, 
    ManyToOne, 
    Relation, 
    JoinColumn
} from 'typeorm';
import { User } from '@/user/user/entity/user.entity';
import { ForumTopic } from '@/social/forum/entity/forum-topic.entity';

@Entity({ name: 'forumPosts' })
export class ForumPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ForumTopic, topic => topic.posts)
  topic: Relation<ForumTopic>;

  @ManyToOne(() => User, user => user.forumPosts)
  user: Relation<User>;
}
