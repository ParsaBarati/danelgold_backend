import { Module } from '@nestjs/common';
import { StoriesController } from './stories.controller';
import { StoriesService } from './stories.service';
import { Story } from './entity/stories.entity';
import { User } from '@/User/user/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Story,User])],
  controllers: [StoriesController],
  providers: [StoriesService]
})
export class StoriesModule {}
