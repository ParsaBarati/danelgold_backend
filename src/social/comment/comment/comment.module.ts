import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from '@/user/user/entity/user.entity';
import {Reply} from '@/social/comment/replyComment/entity/reply.entity';
import {likeComment} from '@/social/comment/like-comment/entity/like-comment.entity';
import {PaginationService} from '@/common/paginate/pagitnate.service';
import {NotificationService} from "@/social/notification/notification.service";
import {Notification} from "@/social/notification/entity/notification.entity";
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Comment } from './entity/comment.entity';

@Module({
    imports: [TypeOrmModule.forFeature([
        Comment,
        Reply,
        likeComment,
        User,
        Notification,
    ])],
    controllers: [CommentController],
    providers: [CommentService, PaginationService, NotificationService],
})
export class CommentModule {
}
