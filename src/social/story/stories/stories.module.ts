import { Module } from '@nestjs/common';
import { Story } from '@/social/story/stories/entity/stories.entity';
import { User } from '@/user/user/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoriesController } from './stories.controller';
import { StoriesService } from './stories.service';

@Module({
  imports: [TypeOrmModule.forFeature([Story,User])],
  controllers: [StoriesController],
  providers: [StoriesService]
})
export class StoriesModule {}
