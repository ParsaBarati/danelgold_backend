import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Post} from "@/social/post/posts/entity/posts.entity";
import {User} from "@/user/user/entity/user.entity";
import {likePost} from "@/social/post/like-post/entity/like-post.entity";
import {NotificationService} from "@/social/notification/notification.service";
import {Notification} from "@/social/notification/entity/notification.entity";
import {HttpModule} from "@nestjs/axios";
import { LikePostController } from './like-post.controller';
import { LikePostService } from './like-post.service';

@Module({
    imports: [TypeOrmModule.forFeature([Post, User, likePost, Notification]),HttpModule],

    controllers: [LikePostController],
    providers: [LikePostService, NotificationService]
})
export class LikePostModule {
}
