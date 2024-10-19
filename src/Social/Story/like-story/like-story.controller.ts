import { Controller, Param, ParseIntPipe, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeController, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { LikeStoryService } from './like-story.service';

@ApiExcludeController()
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
    const userIdentifier = (req.user as any).result.phone || (req.user as any).result.email;
    return await this.likeStoryService.likeStory(storyId,userIdentifier);
    }

    @Post('/:storyId/dislike')
    async dislikePost(
    @Param('storyId', ParseIntPipe) storyId: number,
    @Req () req: Request,
    ){
        const userIdentifier = (req.user as any).result.phone || (req.user as any).result.email;
        return await this.likeStoryService.dislikeStory(storyId,userIdentifier);
    }
}
