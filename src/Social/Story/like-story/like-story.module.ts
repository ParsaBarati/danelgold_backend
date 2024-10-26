import { Module } from '@nestjs/common';
import { LikeStoryController } from './like-story.controller';
import { LikeStoryService } from './like-story.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Post} from "@/Social/Post/posts/entity/posts.entity";
import {User} from "@/User/user/entity/user.entity";
import {likePost} from "@/Social/Post/like-post/entity/like-post.entity";
import {Story} from "@/Social/Story/stories/entity/stories.entity";
import {likeStory} from "@/Social/Story/like-story/entity/like-story.entity";
import { Notification } from '@/Social/Notification/entity/notification.entity';
import { HttpModule } from '@nestjs/axios';
import { NotificationService } from '@/Social/Notification/notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([Story, User, likeStory, Notification]), HttpModule],
  controllers: [LikeStoryController],
  providers: [LikeStoryService, NotificationService]
})
export class LikeStoryModule {}