import {Module} from '@nestjs/common';
import {LikePostController} from './like-post.controller';
import {LikePostService} from './like-post.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Post} from "@/Social/Post/posts/entity/posts.entity";
import {User} from "@/User/user/entity/user.entity";
import {likePost} from "@/Social/Post/like-post/entity/like-post.entity";
import { NotificationService } from '@/Social/Notification/notification.service';
import { Notification } from '@/Social/Notification/entity/notification.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [TypeOrmModule.forFeature([Post, User, likePost, Notification]),HttpModule],

    controllers: [LikePostController],
    providers: [LikePostService,NotificationService]
})
export class LikePostModule {
}
