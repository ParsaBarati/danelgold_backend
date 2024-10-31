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
import {Token} from '@/User/auth/token/entity/token.entity';
import {UserDetail} from '@/User/user-detail/entity/userDetail.entity';
import {Subscribe} from '@/User/subscribe/entity/subscribe.entity';
import {CollectionEntity} from '@/Market/collection/entity/collection.entity';
import {Auction} from '@/Market/auction/entity/auction.entity';
import {Bid} from '@/Market/auction/entity/auctionBid.entity';
import {SupportTicket} from '@/Social/Support-Ticket/ST/entity/support-ticket.entity';
import {ForumTopic} from '@/Social/forum/entity/forum-topic.entity';
import {ForumPost} from '@/Social/forum/entity/forum-post.entity';
import {Story} from '@/Social/Story/stories/entity/stories.entity';
import {Comment} from '@/Social/Comment/comment/entity/comment.entity';
import {NFT} from '@/NFT/nft/entity/nft.entity';
import {likeComment} from '@/Social/Comment/like-comment/entity/like-comment.entity';
import {Post} from '@/Social/Post/posts/entity/posts.entity';
import {likePost} from '@/Social/Post/like-post/entity/like-post.entity';
import {Reply} from '@/Social/Comment/replyComment/entity/reply.entity';
import {likeStory} from '@/Social/Story/like-story/entity/like-story.entity';
import {Club} from '@/Social/Club/entity/club.entity';
import {Notification} from '@/Social/Notification/entity/notification.entity';
import {Wallet} from '@/NFT/wallet/entity/wallet.entity';
import {FollowUser} from '@/Social/Follow/entity/follow.entity';
import {savePost} from "@/Social/Post/save-post/entity/save-post.entity";
import {CryptoBalanceEntity} from "@/NFT/Crypto/entity/cryptoBalance.entity";
import { Message } from '@/Social/Message/message/entity/message.entity';
import { BlockUser } from '@/Social/Block/entity/block.entity';

@Entity({name: 'admin'})
export class Admin {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', nullable: true})
    name: string;

    @Column({type: 'text', nullable: true})
    email: string | null;

    @Column({type: 'text', nullable: true})
    bio: string | null;

    @Column({type: 'varchar', unique: true})
    username: string;

    @Column({type: 'text'})
    password: string;

    @Column({type: 'text', nullable: true})
    firebaseToken: string;

    @Column({type: 'boolean', default: false})
    isVerified: boolean; // New field to mark user verification status

    @Column({type: 'text', nullable: true})
    profilePic: string | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn({nullable: true})
    updatedAt: Date | null;

    @Column({type: 'timestamptz', nullable: true})
    lastLogin: Date | null;
}