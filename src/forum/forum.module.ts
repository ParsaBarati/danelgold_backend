import { Module } from "@nestjs/common";
import { ForumTopic } from "./entity/forum-topic.entity";
import { ForumPost } from "./entity/forum-post.entity";
import { ForumController } from "./forum.controller";
import { ForumService } from "./forum.service";


@Module({
    imports:[ForumTopic,ForumPost],
    controllers:[ForumController],
    providers:[ForumService]
})
export class ForumModule{}