import { Module } from '@nestjs/common';
import { ReplyController } from './reply.controller';
import { ReplyService } from './reply.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reply } from './entity/reply.entity';
import { Comment } from '@/Social/Comment/comment/entity/comment.entity';
import { User } from '@/User/user/entity/user.entity';
import { Notification } from '@/Social/Notification/entity/notification.entity';
import { HttpModule } from '@nestjs/axios';
import { NotificationService } from '@/Social/Notification/notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reply,Comment,User,Notification]),HttpModule],
  controllers: [ReplyController],
  providers: [ReplyService,NotificationService],
})
export class ReplyModule {}
