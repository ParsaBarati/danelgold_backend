import { Module } from '@nestjs/common';
import { ReplyController } from './reply.controller';
import { ReplyService } from './reply.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reply } from './entity/reply.entity';
import { Comment } from '@/Social/Comment/comment/entity/comment.entity';
import { User } from '@/User/user/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reply,Comment,User])],
  controllers: [ReplyController],
  providers: [ReplyService],
})
export class ReplyModule {}
