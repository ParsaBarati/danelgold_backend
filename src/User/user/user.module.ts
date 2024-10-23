import {Module} from "@nestjs/common";
import {User} from "./entity/user.entity";
import {UserController} from "./user.controller";
import {UserService} from "./user.service";
import {Token} from "@/User/auth/token/entity/token.entity";
import {SmsService} from "@/services/sms.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Post} from "@/Social/Post/posts/entity/posts.entity";
import {Story} from "@/Social/Story/stories/entity/stories.entity";
import {Club} from "@/Social/Club/entity/club.entity";
import {FollowUser} from "@/Social/Follow/entity/follow.entity";
import {likePost} from "@/Social/Post/like-post/entity/like-post.entity";
import { savePost } from "@/Social/Post/save-post/entity/save-post.entity";


@Module({
    imports: [TypeOrmModule.forFeature([
        User,
        Token,
        Post,
        savePost,
        Story,
        Club,
        FollowUser,
        likePost,
    ])],
    controllers: [UserController],
    providers: [UserService, SmsService]
})
export class UserModule {
}