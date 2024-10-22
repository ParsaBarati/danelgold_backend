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

        return await this.messageService.getMessage((req.user as any).result)
    }


    @Post('/send')
    async sendMessage(
        @Body('receiverId') receiverId: number,
        @Body('content') content: string,
        @Req() req: Request
    ) {
        return await this.messageService.sendMessage((req.user as any).result, receiverId, content);
    }

    @ApiOperation({summary: 'fetchMessagesByOtherUser'})
    @Get('/chat/:userId')
    async getMessagesForChat(
        @Param('userId', ParseIntPipe) userId: number,
        @Req() req: Request
    ) {
        return await this.messageService.getMessagesForChat((req.user as any).result.id, userId);
    }


}
