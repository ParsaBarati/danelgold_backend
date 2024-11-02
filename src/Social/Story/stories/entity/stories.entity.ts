import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Relation,
    UpdateDateColumn
} from 'typeorm';
import {User} from '@/user/user/entity/user.entity';
import {Comment} from '@/social/comment/comment/entity/comment.entity';
import {ApiProperty} from '@nestjs/swagger';
import {likeStory} from '@/social/story/like-story/entity/like-story.entity';

@Entity('stories')
export class Story {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'text', nullable: true})
    thumbnail: string;

  @Column({type: 'text', array: true, default: []})
    mediaUrl: string[];

    @Column({type: 'int', default: 0})
    likes: number;

    @Column({type: 'int', default: 0})
    dislikes: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({type: 'timestamp', nullable: true})
    expiresAt: Date;

    @OneToMany(() => Comment, comments => comments.story)
    @ApiProperty({type: () => [Comment]})
    comments: Relation<Comment[]>;

    @OneToMany(() => likeStory, storyLikes => storyLikes.story)
    @ApiProperty({type: () => [likeStory]})
    storyLikes: Relation<likeStory[]>;

    @ManyToOne(() => User, user => user.stories)
    @JoinColumn({name: 'userId'})
    @ApiProperty({type: () => User})
    user: Relation<User>;

    @ManyToMany(() => User)
    @JoinTable({
        name: 'story_viewers',
        joinColumn: {name: 'storyId', referencedColumnName: 'id'},
        inverseJoinColumn: {name: 'viewerId', referencedColumnName: 'id'},
    })
    viewers: Relation<User[]>;
}
