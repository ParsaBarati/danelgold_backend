import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiExcludeController, ApiNotFoundResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from '@/common/decorators/roles.decorator';
import { ReplyService } from './reply.service';
import { UpdateReplyDTO } from '@/social/comment/replyComment/dto/UpdateReply.dto';
import { CreateReplyDTO } from '@/social/comment/replyComment/dto/CreateReply.dto';

@ApiExcludeController()
@Controller('reply')
export class ReplyController {
  constructor(private readonly replyService: ReplyService) {}

  @ApiOperation({summary:'Create Reply'})
  @ApiCreatedResponse({description:'موفقیت آمیز',example:{statusCode:201}})
  @ApiNotFoundResponse({description:'Parent comment not found',example:{statusCode:404}})
  @Post()
  async createReply(
    @Req() req: Request, 
    @Body() addReplyDto: CreateReplyDTO
  ){
    const userIdentifier = (req.user as any).phone || (req.user as any).email;
    return await this.replyService.createReply(userIdentifier, addReplyDto);
  }

  @ApiOperation({summary:'Update Reply'})
  @ApiOkResponse({description:'موفقیت آمیز',example:{statusCode:200}})
  @ApiNotFoundResponse({description:'پاسخ پیدا نشد',example:{statusCode:404}})
  @Put('/:replyId')
  async updateReply(
    @Param('replyId') replyId: number,
    @Req() req: Request,
    @Body() updateReplyDto: UpdateReplyDTO,
  ){
    const currentUserIdentifier = (req.user as any).phone || (req.user as any).email;
    return await this.replyService.updateReply(replyId,currentUserIdentifier,updateReplyDto);
  }

  @ApiOperation({summary:'Delete Reply'})
  @ApiOkResponse({description:'پاسخ حذف گردید',example:{statusCode:200}})
  @ApiNotFoundResponse({description:'پاسخی پیدا نشد',example:{statusCode:404}})
  @Delete('/:replyId')
  async deleteReply(
    @Param('replyId') replyId: number,
    @Req() req: Request,
  ){
    const currentUserIdentifier = (req.user as any).phone || (req.user as any).email;
    return await this.replyService.deleteReply(replyId,currentUserIdentifier);
  }

  @Roles('admin')
  @Patch()
  async deleteAdminReplies(
    @Body('replyIds') replyIds: number[],
  ) {
    return await this.replyService.deleteAdminReply(replyIds);
  }
}
