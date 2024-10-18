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
import { CreateReplyDTO } from './dto/CreateReply.dto';
import { ReplyService } from './reply.service';
import { UpdateReplyDTO } from './dto/UpdateReply.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from '@/common/decorators/roles.decorator';


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
    const userPhone = (req.user as any).result.phone;
    return await this.replyService.createReply(userPhone, addReplyDto);
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
    const currentUserPhone = (req.user as any).result.phone;
    return await this.replyService.updateReply(replyId,currentUserPhone,updateReplyDto);
  }

  @ApiOperation({summary:'Delete Reply'})
  @ApiOkResponse({description:'پاسخ حذف گردید',example:{statusCode:200}})
  @ApiNotFoundResponse({description:'پاسخی پیدا نشد',example:{statusCode:404}})
  @Delete('/:replyId')
  async deleteReply(
    @Param('replyId') replyId: number,
    @Req() req: Request,
  ){
    const currentUserPhone = (req.user as any).result.phone;
    return await this.replyService.deleteReply(replyId,currentUserPhone);
  }

  @Roles('admin')
  @Patch()
  async deleteAdminReplies(
    @Body('replyIds') replyIds: number[],
  ) {
    return await this.replyService.deleteAdminReply(replyIds);
  }
}
