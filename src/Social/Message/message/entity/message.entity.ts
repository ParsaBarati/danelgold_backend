import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Relation
} from 'typeorm';
import {ApiProperty} from '@nestjs/swagger';
import {User} from '@/User/user/entity/user.entity';
import {Post} from "@/Social/Post/posts/entity/posts.entity";
import {Story} from "@/Social/Story/stories/entity/stories.entity";
import {likeMessage} from '../../like-message/entity/like-message.entity';
import {Upload} from "@/upload/entity/uplaod.entity";

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'text', nullable: true})
    content: string | null;

    @Column({type: 'int', default: 0})
    likes: number;

    @CreateDateColumn()
    createdAt: Date;

    @Column({type: 'boolean', default: false})
    isLiked: boolean;

    @ManyToOne(() => User, (sender) => sender.sentMessages)
    @JoinColumn({name: 'senderId', referencedColumnName: 'id'})
    @ApiProperty({type: () => User})
    sender: Relation<User>;

    @ManyToOne(() => User, (receiver) => receiver.receivedMessages)
    @ApiProperty({type: () => User})
    receiver: Relation<User>;

    // For story reply (null if not a story reply)
    @Column({type: 'int', nullable: true})
    storyId: number;
    // For story reply (null if not a story reply)
    @Column({type: 'int'})
    senderId: number;

    // For post sharing (null if not a post sharing)
    @Column({type: 'int', nullable: true})
    postId: number;

    // For message reply (null if not a message reply)
    @Column({type: 'int', nullable: true})
    replyId: number;

    // For story reply (null if not a story reply)
    @Column({type: 'int', nullable: true})
    storyReplyId: number;

    // has the recepient read this message
    @Column({type: 'boolean', default: false})
    isRead: boolean;

    // For shared stories or posts (null if not shared)
    @Column({type: 'boolean', default: false})
    isShared: boolean;


    // For media (null if not a message reply)
    @Column({type: 'int', nullable: true})
    mediaId: number;

    @ManyToOne(() => Upload, {nullable: true})
    @JoinColumn({name: 'mediaId', referencedColumnName: 'id'})
    @ApiProperty({type: () => Upload})
    media: Relation<Upload>;

    @OneToMany(() => likeMessage, (messagelikes) => messagelikes.message)
    @ApiProperty({type: () => likeMessage})
    messagelikes: Relation<likeMessage[]>

    @ManyToOne(() => Post, (post) => [])
    @JoinColumn({name: 'postId', referencedColumnName: 'id'})
    @ApiProperty({type: () => Post})
    post: Relation<Post>;

    @ManyToOne(() => Story, (story) => [])
    @JoinColumn({name: 'storyId', referencedColumnName: 'id'})
    @ApiProperty({type: () => Story})
    story: Relation<Story>;

    // self-referencing relation to other messages
    @ManyToOne(() => Message, {nullable: true})
    @JoinColumn({name: 'replyId', referencedColumnName: 'id'})
    @ApiProperty({type: () => Message})
    replyMessage: Relation<Message> | null;

    // relationship to Story
    @ManyToOne(() => Story, {nullable: true})
    @JoinColumn({name: 'storyReplyId', referencedColumnName: 'id'})
    @ApiProperty({type: () => Story})
    storyReply: Relation<Story> | null;
}
