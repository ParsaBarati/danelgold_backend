import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Post} from './entity/posts.entity';
import {User} from '@/User/user/entity/user.entity';
import {PostsController} from './posts.controller';
import {PostService} from './posts.service';
import {PaginationService} from '@/common/paginate/pagitnate.service';
import {Comment} from "@/Social/Comment/comment/entity/comment.entity";
import {CommentService} from "@/Social/Comment/comment/comment.service";
import {Story} from "@/Social/Story/stories/entity/stories.entity";
import {Reply} from "@/Social/Comment/replyComment/entity/reply.entity";
import {likeComment} from "@/Social/Comment/like-comment/entity/like-comment.entity";
import {likePost} from "@/Social/Post/like-post/entity/like-post.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Post, User, Comment, Story, Reply, likeComment, Comment, likePost])],
    controllers: [PostsController],
    providers: [PostService, PaginationService, CommentService]
})
export class PostsModule {
}
