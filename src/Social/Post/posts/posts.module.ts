import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from '@/user/user/entity/user.entity';
import {PaginationService} from '@/common/paginate/pagitnate.service';
import {Comment} from "@/social/comment/comment/entity/comment.entity";
import {CommentService} from "@/social/comment/comment/comment.service";
import {Story} from "@/social/story/stories/entity/stories.entity";
import {Reply} from "@/social/comment/replyComment/entity/reply.entity";
import {likeComment} from "@/social/comment/like-comment/entity/like-comment.entity";
import {likePost} from "@/social/post/like-post/entity/like-post.entity";
import {SearchController} from "@/search/search.controller";
import {NFT} from "@/nft/nft/entity/nft.entity";
import {CollectionEntity} from "@/market/collection/entity/collection.entity";
import {SearchService} from "@/search/search.service";
import {FollowUser} from '@/social/follow/entity/follow.entity';
import {NotificationService} from "@/social/notification/notification.service";
import {Notification} from "@/social/notification/entity/notification.entity";
import { PostsController } from './posts.controller';
import { PostService } from './posts.service';
import { Post } from './entity/posts.entity';

@Module({
    imports: [TypeOrmModule.forFeature([
        Post,
        User,
        Comment,
        Story,
        Reply,
        likeComment,
        Comment,
        likePost,
        NFT,
        CollectionEntity,
        FollowUser,
        Notification
    ])],
    controllers: [PostsController, SearchController],
    providers: [PostService, PaginationService, CommentService, SearchService, NotificationService]
})
export class PostsModule {
}
