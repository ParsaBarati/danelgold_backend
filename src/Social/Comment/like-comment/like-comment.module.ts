import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '@/social/comment/comment/entity/comment.entity';
import { likeComment } from '@/social/comment/like-comment/entity/like-comment.entity';
import { LikeCommentController } from './like-comment.controller';
import { LikeCommentService } from './like-comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([likeComment,Comment])],
  controllers: [LikeCommentController],
  providers: [LikeCommentService],
})
export class LikeCommentModule {}
