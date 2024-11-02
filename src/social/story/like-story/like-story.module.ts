import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "@/user/user/entity/user.entity";
import {Story} from "@/social/story/stories/entity/stories.entity";
import {likeStory} from "@/social/story/like-story/entity/like-story.entity";
import { LikeStoryController } from './like-story.controller';
import { LikeStoryService } from './like-story.service';

@Module({
  imports: [TypeOrmModule.forFeature([Story, User, likeStory])],
  controllers: [LikeStoryController],
  providers: [LikeStoryService]
})
export class LikeStoryModule {}