import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation} from 'typeorm';
import {ApiProperty} from '@nestjs/swagger';
import {User} from '@/User/user/entity/user.entity';
import {Post} from "@/Social/Post/posts/entity/posts.entity";
import {Story} from "@/Social/Story/stories/entity/stories.entity";

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'text', nullable: true})
    content: string | null;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, (sender) => sender.sentMessages)
    @ApiProperty({type: () => User})
    sender: Relation<User>;

    @ManyToOne(() => User, (receiver) => receiver.receivedMessages)
    @ApiProperty({type: () => User})
    receiver: Relation<User>;

    // For story reply (null if not a story reply)
    @Column({type: 'int', nullable: true})
    storyId: number;

    // For post sharing (null if not a post sharing)
    @Column({type: 'int', nullable: true})
    postId: number;

    // For message reply (null if not a message reply)
    @Column({type: 'int', nullable: true})
    replyId: number;

    // For shared stories or posts (null if not shared)
    @Column({type: 'boolean', default: false})
    isShared: boolean;


    @ManyToOne(() => Post, (post) => [])
    @JoinColumn({name: 'postId', referencedColumnName: 'id'})
    @ApiProperty({type: () => Post})
    post: Relation<Post>;

    @ManyToOne(() => Story, (story) => [])
    @JoinColumn({name: 'storyId', referencedColumnName: 'id'})
    @ApiProperty({type: () => Story})
    story: Relation<Story>;

}
