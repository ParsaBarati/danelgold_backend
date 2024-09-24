import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn, 
    ManyToOne, 
    OneToMany, 
    Relation 
} from 'typeorm';
import { User } from '@/User/user/entity/user.entity';
import { ForumPost } from './forum-post.entity';

@Entity()
export class ForumTopic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.forumTopics)
  user: Relation<User>;

  @OneToMany(() => ForumPost, (posts) => posts.topic)
  posts: Relation<ForumPost[]>;

}
