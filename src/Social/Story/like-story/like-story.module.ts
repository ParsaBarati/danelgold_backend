import { Module } from '@nestjs/common';
import { LikeStoryController } from './like-story.controller';
import { LikeStoryService } from './like-story.service';

@Module({
  controllers: [LikeStoryController],
  providers: [LikeStoryService]
})
export class LikeStoryModule {}