import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Relation,
    UpdateDateColumn,
} from 'typeorm';
import {User} from '@/user/user/entity/user.entity';
import {Comment} from '@/social/comment/comment/entity/comment.entity';
import {ApiProperty} from '@nestjs/swagger';
import {likePost} from '@/social/post/like-post/entity/like-post.entity';
import {savePost} from "@/social/post/save-post/entity/save-post.entity";

@Entity('posts')
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'text'})
    mediaUrl: string;
    @Column({type: 'text'})
    media: string;

    @Column({type: 'text', array: true, default: []})
    content: string[];

    @Column({type: 'text'})
    caption: string;

    @Column({type: 'int', default: 0})
    likes: number;

    @Column({type: 'int', default: 0})
    saves: number;

    @Column({type: 'int', default: 0})
    dislikes: number;

    @Column({type: 'int', default: 0})
    shares: number; // New field for shares

    @Column({type: 'boolean', default: false})
    isSaved: boolean; // New field for isSaved

    @Column({type: 'boolean', default: false})
    isLiked: boolean; // New field for isLiked

    @Column({type: 'boolean', default: false})
    isDisliked: boolean; // New field for isDisliked

    @Column({type: 'boolean', default: false})
    isReel: boolean;

    @Column({type: 'text', nullable: true})
    qrLink: string; // New field for QR link

    @Column({type: 'text', nullable: true})
    buyLink: string; // New field for Buy link

    @Column({type: 'varchar', nullable: true})
    likedBy: string; // New field for likedBy, assuming it stores a username

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Comment, comments => comments.post, {cascade: true})
    @ApiProperty({type: () => [Comment]})
    comments: Relation<Comment[]>;

    @OneToMany(() => likePost, postLikes => postLikes.post)
    @ApiProperty({type: () => [likePost]})
    postLikes: Relation<likePost[]>;

    @OneToMany(() => savePost, postSaves => postSaves.post)
    @ApiProperty({type: () => [savePost]})
    postSaves: Relation<savePost[]>;

    @ManyToOne(() => User, user => user.posts)
    @ApiProperty({type: () => User})
    user: Relation<User>;
}