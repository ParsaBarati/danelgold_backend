import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "@/user/user/entity/user.entity";
import {NotificationService} from "@/social/notification/notification.service";
import {Notification} from "@/social/notification/entity/notification.entity";
import {likePost} from "@/social/post/like-post/entity/like-post.entity";
import {savePost} from "@/social/post/save-post/entity/save-post.entity";
import {Post} from "@/social/post/posts/entity/posts.entity";
import {Story} from "@/social/story/stories/entity/stories.entity";
import {BlockUser} from "@/social/block/entity/block.entity";
import {Upload} from "@/upload/entity/uplaod.entity";
import { MessageController } from "./message.controller";
import { MessageService } from "./message.service";
import { Message } from "./entity/message.entity";


@Module({
    imports: [TypeOrmModule.forFeature([Message, User, Notification, likePost, savePost, Post, Story, BlockUser, Upload])],
    controllers: [MessageController],
    providers: [MessageService, NotificationService]
})
export class MessageModule {
}