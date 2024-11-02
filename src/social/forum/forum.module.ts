import { Module } from "@nestjs/common";
import { ForumTopic } from "@/social/forum/entity/forum-topic.entity";
import { ForumPost } from "@/social/forum/entity/forum-post.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@/user/user/entity/user.entity";
import { PaginationService } from "@/common/paginate/pagitnate.service";
import { ForumController } from "./forum.controller";
import { ForumService } from "./forum.service";


@Module({
    imports:[TypeOrmModule.forFeature([ForumTopic,ForumPost,User])],
    controllers:[ForumController],
    providers:[ForumService,PaginationService]
})
export class ForumModule{}