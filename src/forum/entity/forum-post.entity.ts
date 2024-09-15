import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn, 
    ManyToOne, 
    Relation 
} from 'typeorm';
import { ForumTopic } from './forum-topic.entity';
import { User } from '@/user/entity/user.entity';

@Entity()
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
