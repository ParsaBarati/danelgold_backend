import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entity/comment.entity';
import { User } from '@/User/user/entity/user.entity';
import { Reply } from '@/Social/reply/entity/reply.entity';
import { likeComment } from '@/Social/Comment/like-comment/entity/like-comment.entity';
import { PaginationService } from '@/common/paginate/pagitnate.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    Comment,
    Reply,
    likeComment,
    User,
  ])],
  controllers: [CommentController],
  providers: [CommentService,PaginationService],
})
export class CommentModule {}
