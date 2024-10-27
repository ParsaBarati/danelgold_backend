import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "@/User/user/entity/user.entity";
import { NotificationService } from '@/Social/Notification/notification.service';
import { Notification } from '@/Social/Notification/entity/notification.entity';
import { HttpModule } from '@nestjs/axios';
import { Message } from '../message/entity/message.entity';
import { likeMessage } from './entity/like-message.entity';
import { LikeCommentController } from '@/Social/Comment/like-comment/like-comment.controller';
import { LikeCommentService } from '@/Social/Comment/like-comment/like-comment.service';
import { Comment } from '@/Social/Comment/comment/entity/comment.entity';
import { likeComment } from '@/Social/Comment/like-comment/entity/like-comment.entity';

@Module({
    imports: [TypeOrmModule.forFeature([
        Message, 
        User, 
        likeMessage,
        Comment,
        likeComment, 
        Notification,
    ]),HttpModule],

    controllers: [LikeCommentController],
    providers: [LikeCommentService,NotificationService]
})
export class LikeMessageModule {
}
