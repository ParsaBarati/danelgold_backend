import {Module} from '@nestjs/common';
import {SavePostController} from './save-post.controller';
import {SavePostService} from './save-post.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Post} from "@/Social/Post/posts/entity/posts.entity";
import {User} from "@/User/user/entity/user.entity";
import {likePost} from "@/Social/Post/like-post/entity/like-post.entity";
import {savePost} from "@/Social/Post/save-post/entity/save-post.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Post, User, likePost, savePost,])],

    controllers: [SavePostController],
    providers: [SavePostService]
})
export class SavePostModule {
}
