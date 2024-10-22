import {
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeController, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LikeCommentService } from './like-comment.service';
import { Request } from 'express';

@ApiExcludeController()
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
    const userIdentifier = (req.user as any).phone || (req.user as any).email;
    return await this.likeCommentService.likeComment(commentId,userIdentifier);
  }

  @Post('/:commentId/dislike')
  async dislikeComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Req () req: Request,
  ){
    const userIdentifier = (req.user as any).phone || (req.user as any).email;
    return await this.likeCommentService.dislikeComment(commentId,userIdentifier);
  }
}
