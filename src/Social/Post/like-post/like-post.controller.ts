import { Controller, Param, ParseIntPipe, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeController, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LikePostService } from '@/Social/Post/like-post/like-post.service';
import { Request } from 'express';

// @ApiExcludeController()
@ApiBearerAuth()
@ApiTags('Likes')

@Controller('like-post')
export class LikePostController {
    constructor(private readonly likePostService: LikePostService) {}

    @ApiOperation({summary:'Like Post'})
    @ApiOkResponse({description:'Liked',example:{statusCode:200}})
    @Post('/:postId/like')
    async likePost(
    @Param('postId', ParseIntPipe) postId: number,
    @Req () req: Request,
    ){

    return await this.likePostService.likePost(postId,(req.user as any));
    }

    @Post('/:postId/dislike')
    async dislikePost(
    @Param('postId', ParseIntPipe) postId: number,
    @Req () req: Request,
    ){

    return await this.likePostService.dislikePost(postId,(req.user as any));
    }
}
