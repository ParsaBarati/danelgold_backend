import { Controller, Param, ParseIntPipe, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { LikeStoryService } from './like-story.service';

@ApiTags('LikeStory')
@ApiBearerAuth()
@Controller('like-story')
export class LikeStoryController {
    constructor(private readonly likeStoryService: LikeStoryService) {}

    @ApiOperation({summary:'Like Story'})
    @ApiOkResponse({description:'Liked',example:{statusCode:200}})
    @Post('/:storyId/like')
    async likePost(
    @Param('storyId', ParseIntPipe) storyId: number,
    @Req () req: Request,
    ){
    const userPhone = (req.user as any).result.phone;
    return await this.likeStoryService.likeStory(storyId,userPhone);
    }

    @Post('/:storyId/dislike')
    async dislikePost(
    @Param('storyId', ParseIntPipe) storyId: number,
    @Req () req: Request,
    ){
    const userPhone = (req.user as any).result.phone;
    return await this.likeStoryService.dislikeStory(storyId,userPhone);
    }
}
