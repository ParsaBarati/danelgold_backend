import { Module } from "@nestjs/common";
import { ForumTopic } from "./entity/forum-topic.entity";
import { ForumPost } from "./entity/forum-post.entity";
import { ForumController } from "./forum.controller";
import { ForumService } from "./forum.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@/User/user/entity/user.entity";
import { PaginationService } from "@/common/paginate/pagitnate.service";


@Module({
    imports:[TypeOrmModule.forFeature([ForumTopic,ForumPost,User])],
    controllers:[ForumController],
    providers:[ForumService,PaginationService]
})
export class ForumModule{}