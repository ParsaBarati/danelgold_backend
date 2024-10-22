import {Module} from '@nestjs/common';
import {LikePostController} from './like-post.controller';
import {LikePostService} from './like-post.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Post} from "@/Social/Post/posts/entity/posts.entity";
import {User} from "@/User/user/entity/user.entity";
import {likePost} from "@/Social/Post/like-post/entity/like-post.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Post, User, likePost])],

    controllers: [LikePostController],
    providers: [LikePostService]
})
export class LikePostModule {
}
