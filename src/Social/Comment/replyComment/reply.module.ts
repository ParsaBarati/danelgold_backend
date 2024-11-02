import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reply } from '@/social/comment/replyComment/entity/reply.entity';
import { Comment } from '@/social/comment/comment/entity/comment.entity';
import { User } from '@/user/user/entity/user.entity';
import { ReplyController } from './reply.controller';
import { ReplyService } from './reply.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reply,Comment,User])],
  controllers: [ReplyController],
  providers: [ReplyService],
})
export class ReplyModule {}
