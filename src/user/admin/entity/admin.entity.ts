import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    Relation,
    UpdateDateColumn
} from 'typeorm';
import {ApiProperty} from '@nestjs/swagger';
import {Token} from '@/user/auth/token/entity/token.entity';
import {UserDetail} from '@/user/user-detail/entity/userDetail.entity';
import {Subscribe} from '@/user/subscribe/entity/subscribe.entity';
import {CollectionEntity} from '@/market/collection/entity/collection.entity';
import {Auction} from '@/market/auction/entity/auction.entity';
import {SupportTicket} from '@/social/support-ticket/st/entity/support-ticket.entity';
import {ForumTopic} from '@/social/forum/entity/forum-topic.entity';
import {Story} from '@/social/story/stories/entity/stories.entity';
import {Comment} from '@/social/comment/comment/entity/comment.entity';
import {NFT} from '@/nft/nft/entity/nft.entity';
import {likeComment} from '@/social/comment/like-comment/entity/like-comment.entity';
import {Post} from '@/social/post/posts/entity/posts.entity';
import {likePost} from '@/social/post/like-post/entity/like-post.entity';
import {Reply} from '@/social/comment/replyComment/entity/reply.entity';
import {likeStory} from '@/social/story/like-story/entity/like-story.entity';
import {Club} from '@/social/club/entity/club.entity';
import {Notification} from '@/social/notification/entity/notification.entity';
import {Wallet} from '@/nft/wallet/entity/wallet.entity';
import {FollowUser} from '@/social/follow/entity/follow.entity';
import {savePost} from "@/social/post/save-post/entity/save-post.entity";
import {CryptoBalanceEntity} from "@/nft/crypto/entity/cryptoBalance.entity";
import { Message } from '@/social/message/message/entity/message.entity';
import { BlockUser } from '@/social/block/entity/block.entity';

export enum AdminRole {
    OPERATOR = 'operator',
    ADMIN = 'admin',
    SUPERADMIN = 'superadmin'
}

@Entity({name: 'admin'})
export class Admin {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', nullable: true})
    name: string;

    @Column({type: 'text', nullable: true})
    email: string | null;

    @Column({type: 'varchar', unique: true})
    username: string;

    @Column({type: 'text'})
    password: string;

    @Column({type: 'text', nullable: true})
    profilePic: string | null;

    @Column( 'enum' , {
        enum: AdminRole
    })
    role: AdminRole;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn({nullable: true})
    updatedAt: Date | null;

    @Column({type: 'timestamptz', nullable: true})
    lastLogin: Date | null;

    @OneToMany(() => Token, (token) => token.admin)
    @ApiProperty({type: () => [Token]})
    tokens: Relation<Token[]>;
}