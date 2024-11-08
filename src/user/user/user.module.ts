import {Module} from "@nestjs/common";
import {User} from "@/user/user/entity/user.entity";
import {UserController} from "@/user/user/user.controller";
import {UserService} from "@/user/user/user.service";
import {Token} from "@/user/auth/token/entity/token.entity";
import {SmsService} from "@/services/sms.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Post} from "@/social/post/posts/entity/posts.entity";
import {Story} from "@/social/story/stories/entity/stories.entity";
import {Club} from "@/social/club/entity/club.entity";
import {FollowUser} from "@/social/follow/entity/follow.entity";
import {likePost} from "@/social/post/like-post/entity/like-post.entity";
import {savePost} from "@/social/post/save-post/entity/save-post.entity";
import {likeStory} from "@/social/story/like-story/entity/like-story.entity";
import {NotificationService} from "@/social/notification/notification.service";
import {Notification} from "@/social/notification/entity/notification.entity";
import {HttpModule} from "@nestjs/axios";
import { BlockUser } from "@/social/block/entity/block.entity";
import {BlogPost} from "@/social/blog/blog-post/entity/blog-post.entity";
import {BlogCategory} from "@/social/blog/blog-catagory/entity/blog-catagory.entity";
import {NFT} from "@/nft/nft/entity/nft.entity";


@Module({
    imports: [TypeOrmModule.forFeature([
        User,
        Token,
        Post,
        savePost,
        Story,
        Club,
        FollowUser,
        BlockUser,
        likePost,
        BlogPost,
        BlogCategory,
        likeStory,
        NFT,
        Notification,
    ])],
    controllers: [UserController],
    providers: [UserService, SmsService, NotificationService]
})
export class UserModule {
}