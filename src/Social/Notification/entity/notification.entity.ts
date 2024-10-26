import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Relation} from 'typeorm';
import {User} from '@/User/user/entity/user.entity';
import {ApiProperty} from '@nestjs/swagger';

export enum NotificationAction {
    FOLLOW = 'follow',
    UNFOLLOW = 'unfollow',
    MESSAGE = 'message',
    LIKE = 'like',
    DISLIKE = 'dislike',
    COMMENT = 'comment',
    REPLY = 'reply',
    MENTION = 'mention',
    SHARE = 'share',
    REPOST = 'repost',
    SUGGESTION = 'suggestion',
}

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar'})
    title: string;

    @Column({type: 'varchar', nullable: true})
    thumb: string | null;

    @Column({
        type: 'enum',
        enum: NotificationAction,
    })
    action: NotificationAction;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.sentNotifications, {nullable: true})
    @ApiProperty({type: () => User})
    user: Relation<User> | null;

    @ManyToOne(() => User, (user) => user.receivedNotifications)
    @ApiProperty({type: () => User})
    recipient: Relation<User>;
}

