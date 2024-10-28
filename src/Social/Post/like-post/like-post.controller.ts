import { Controller, Param, ParseIntPipe, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LikePostService } from '@/Social/Post/like-post/like-post.service';
import { Request } from 'express';

@ApiBearerAuth()
@ApiTags('Likes')
@Controller('like-post')
export class LikePostController {
    constructor(private readonly likePostService: LikePostService) {}

    @ApiOperation({ summary: 'Like Post' })
    @ApiOkResponse({
        description: 'Successfully liked the post',
        schema: { example: { statusCode: 200, message: 'Post liked successfully' } }
    })
    @Post('/:postId/like')
    async likePost(
        @Param('postId', ParseIntPipe) postId: number,
        @Req() req: Request,
    ) {
        return await this.likePostService.likePost(postId, req.user as any);
    }

    @ApiOperation({ summary: 'Dislike Post' })
    @ApiOkResponse({
        description: 'Successfully disliked the post',
        schema: { example: { statusCode: 200, message: 'Post disliked successfully' } }
    })
    @Post('/:postId/dislike')
    async dislikePost(
        @Param('postId', ParseIntPipe) postId: number,
        @Req() req: Request,
    ) {
        return await this.likePostService.dislikePost(postId, req.user as any);
    }
}
