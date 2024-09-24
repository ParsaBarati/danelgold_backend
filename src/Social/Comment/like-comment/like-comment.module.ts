import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '@/Social/Comment/comment/entity/comment.entity';
import { LikeCommentController } from './like-comment.controller';
import { LikeCommentService } from './like-comment.service';
import { likeComment } from './entity/like-comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([likeComment,Comment])],
  controllers: [LikeCommentController],
  providers: [LikeCommentService],
})
export class LikeCommentModule {}
