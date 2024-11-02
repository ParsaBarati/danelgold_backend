import {Body, Controller, Get, Param, ParseIntPipe, Post, Req} from "@nestjs/common";
import {Request} from "express";
import {ApiBearerAuth, ApiBody, ApiOperation, ApiTags} from "@nestjs/swagger";
import { MessageService } from "@/social/message/message/message.service";

@ApiTags('Messages')
@ApiBearerAuth()
@Controller('message')
export class MessageController {
    constructor(private readonly messageService: MessageService) {
    }

    @ApiOperation({summary: 'Retrieve all messages for the current user'})
    @Get()
    async getMessages(
        @Req() req: Request
    ) {
        return await this.messageService.getMessage((req.user as any));
    }

    @ApiOperation({summary: 'Send a message to another user'})
    @ApiBody({
        schema: {
            properties: {
                receiverId: {type: 'integer', example: 1},
                content: {type: 'string', example: 'Hello!'},
                storyId: {type: 'integer', example: 10, nullable: true},
                postId: {type: 'integer', example: 15, nullable: true},
                replyId: {type: 'integer', example: 5, nullable: true},
            }
        }
    })
    @Post('/send')
    async sendMessage(
        @Body('receiverId') receiverId: number,
        @Body('content') content: string,
        @Req() req: Request,
        @Body('mediaId') mediaId?: number,
        @Body('storyId') storyId?: number,
        @Body('postId') postId?: number,
        @Body('replyId') replyId?: number,
        @Body('isStoryReply') isStoryReply?: boolean, // Add isStoryReply parameter
    ) {
        return await this.messageService.sendMessage(
            (req.user as any),
            receiverId,
            content,
            mediaId,
            storyId,
            postId,
            replyId,
            isStoryReply // Pass the isStoryReply parameter to the service
        );
    }


    @ApiOperation({summary: 'Share content with multiple users'})
    @ApiBody({
        schema: {
            properties: {
                receiverIds: {type: 'array', items: {type: 'integer'}, example: [1, 2, 3]},
                content: {type: 'string', example: 'Check this out!'},
                storyId: {type: 'integer', example: 10, nullable: true},
                postId: {type: 'integer', example: 15, nullable: true},
            }
        }
    })
    @Post('/share')
    async shareContent(
        @Body('receiverIds') receiverIds: number[], // Accept an array of user IDs
        @Body('content') content: string,
        @Req() req: Request,
        @Body('storyId') storyId?: number,
        @Body('postId') postId?: number,
    ) {
        return await this.messageService.shareContent(
            (req.user as any),
            receiverIds,
            content,
            storyId,
            postId
        );
    }

    @ApiOperation({summary: 'Fetch chat messages between current user and another user'})
    @Get('/chat/:userId')
    async getMessagesForChat(
        @Param('userId', ParseIntPipe) userId: number,
        @Req() req: Request
    ) {
        return await this.messageService.getMessagesForChat((req.user as any).id, userId);
    }

    @ApiOperation({summary: 'Fetch posts shared in chat with another user'})
    @Get('/chat/:userId/posts')
    async getPostsForChat(
        @Param('userId', ParseIntPipe) userId: number,
        @Req() req: Request
    ) {
        return await this.messageService.getPostsInChat((req.user as any).id, userId);
    }
}
