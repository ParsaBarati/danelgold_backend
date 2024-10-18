import {
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LikeCommentService } from './like-comment.service';
import { Request } from 'express';

@Controller('like-comment')
export class LikeCommentController {
  constructor(private readonly likeCommentService: LikeCommentService) {}

  @ApiOperation({summary:'Like Comment'})
  @ApiOkResponse({description:'Liked',example:{statusCode:200}})
  @Post('/:commentId/like')
  async likeComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Req () req: Request,
  ){
    const userPhone = (req.user as any).result.phone;
    return await this.likeCommentService.likeComment(commentId,userPhone);
  }

  @Post('/:commentId/dislike')
  async dislikeComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Req () req: Request,
  ){
    const userPhone = (req.user as any).result.phone;
    return await this.likeCommentService.dislikeComment(commentId,userPhone);
  }
}
