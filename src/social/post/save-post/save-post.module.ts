import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Post} from "@/social/post/posts/entity/posts.entity";
import {User} from "@/user/user/entity/user.entity";
import {likePost} from "@/social/post/like-post/entity/like-post.entity";
import {savePost} from "@/social/post/save-post/entity/save-post.entity";
import { SavePostController } from './save-post.controller';
import { SavePostService } from './save-post.service';

@Module({
    imports: [TypeOrmModule.forFeature([Post, User, likePost, savePost,])],

    controllers: [SavePostController],
    providers: [SavePostService]
})
export class SavePostModule {
}
