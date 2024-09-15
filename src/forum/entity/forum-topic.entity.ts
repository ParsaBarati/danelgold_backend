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
import { ForumPost } from './forum-post.entity';
import { User } from '@/user/entity/user.entity';


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
