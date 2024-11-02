import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "@/user/user/entity/user.entity";
import { NotificationService } from '@/social/notification/notification.service';
import { Notification } from '@/social/notification/entity/notification.entity';
import { HttpModule } from '@nestjs/axios';
import { Message } from '@/social/message/message/entity/message.entity';
import { likeMessage } from '@/social/message/like-message/entity/like-message.entity';
import { LikeCommentController } from '@/social/comment/like-comment/like-comment.controller';
import { LikeCommentService } from '@/social/comment/like-comment/like-comment.service';
import { Comment } from '@/social/comment/comment/entity/comment.entity';
import { likeComment } from '@/social/comment/like-comment/entity/like-comment.entity';

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
