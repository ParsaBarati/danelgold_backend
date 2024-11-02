import { Controller, Param, ParseIntPipe, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeController, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { LikeMessageService } from './like-message.service';

// @ApiExcludeController()
@ApiBearerAuth()
@ApiTags('LikeMessages')

@Controller('like-message')
export class LikeMessageController {
    constructor(private readonly likeMessageService: LikeMessageService) {}

    @ApiOperation({summary:'Like Message'})
    @ApiOkResponse({description:'Liked',example:{statusCode:200}})
    @Post('/:messageId/like')
    async likeMessage(
    @Param('messageId', ParseIntPipe) messageId: number,
    @Req () req: Request,
    ){

    return await this.likeMessageService.likeMessage(messageId,(req.user as any));
    }

}
