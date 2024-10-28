import { Controller, Param, ParseIntPipe, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { LikeStoryService } from './like-story.service';

@ApiBearerAuth()
@ApiTags('Likes')
@Controller('like-story')
export class LikeStoryController {
    constructor(private readonly likeStoryService: LikeStoryService) {}

    @ApiOperation({ summary: 'Like Story' })
    @ApiOkResponse({
        description: 'Successfully liked the story',
        schema: { example: { statusCode: 200, message: 'Story liked successfully' } }
    })
    @Post('/:storyId/like')
    async likeStory(
        @Param('storyId', ParseIntPipe) storyId: number,
        @Req() req: Request,
    ) {
        return await this.likeStoryService.likeStory(storyId, req.user as any);
    }

}
