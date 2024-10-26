import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '@/Social/Comment/comment/entity/comment.entity';
import { LikeCommentController } from './like-comment.controller';
import { LikeCommentService } from './like-comment.service';
import { likeComment } from './entity/like-comment.entity';
import { Notification } from '@/Social/Notification/entity/notification.entity';
import { HttpModule } from '@nestjs/axios';
import { NotificationService } from '@/Social/Notification/notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([likeComment,Comment,Notification]),HttpModule],
  controllers: [LikeCommentController],
  providers: [LikeCommentService,NotificationService],
})
export class LikeCommentModule {}
