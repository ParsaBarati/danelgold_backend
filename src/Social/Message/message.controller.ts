import {Body, Controller, Get, Param, ParseIntPipe, Post, Req} from "@nestjs/common";
import {MessageService} from "./message.service";
import {Request} from "express";
import {ApiBearerAuth, ApiOperation, ApiTags} from "@nestjs/swagger";

@ApiTags('Message')
@ApiBearerAuth()

@Controller('message')
export class MessageController {
    constructor(private readonly messageService: MessageService) {
    }

    @ApiOperation({summary: 'getMessages'})
    @Get()
    async getMessage(
        @Req() req: Request
    ) {

        return await this.messageService.getMessage((req.user as any))
    }


    @Post('/send')
    async sendMessage(
        @Body('receiverId') receiverId: number,
        @Body('content') content: string,
        @Req() req: Request,
        @Body('storyId') storyId?: number,
        @Body('postId') postId?: number,
        @Body('replyId') replyId?: number,
    ) {
        return await this.messageService.sendMessage(
            (req.user as any), 
            receiverId, 
            content,
            storyId,
            postId,
            replyId
        );
    }


    @Post('/share')
    async share(
        @Body('receiverIds') receiverIds: number[], // Accept an array of user IDs
        @Body('content') content: string,
        @Req() req: Request,
        @Body('storyId') storyId?: number,
        @Body('postId') postId?: number,
    ) {
        return await this.messageService.shareContent(
            (req.user as any),
            receiverIds, // Pass the array of receiver IDs
            content,
            storyId,
            postId,
        );
    }


    @ApiOperation({summary: 'fetchMessagesByOtherUser'})
    @Get('/chat/:userId')
    async getMessagesForChat(
        @Param('userId', ParseIntPipe) userId: number,
        @Req() req: Request
    ) {
        return await this.messageService.getMessagesForChat((req.user as any).id, userId);
    }


}
