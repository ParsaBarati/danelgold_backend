import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Message} from "./entity/message.entity";
import {MessageController} from "./message.controller";
import {MessageService} from "./message.service";
import {User} from "@/User/user/entity/user.entity";
import {NotificationService} from "@/Social/Notification/notification.service";
import {Notification} from "@/Social/Notification/entity/notification.entity";
import {HttpModule} from "@nestjs/axios";
import {likePost} from "@/Social/Post/like-post/entity/like-post.entity";
import {savePost} from "@/Social/Post/save-post/entity/save-post.entity";
import {Post} from "@/Social/Post/posts/entity/posts.entity";
import {Story} from "@/Social/Story/stories/entity/stories.entity";


@Module({
    imports: [TypeOrmModule.forFeature([Message, User, Notification, likePost, savePost, Post, Story]), HttpModule],
    controllers: [MessageController],
    providers: [MessageService, NotificationService]
})
export class MessageModule {
}