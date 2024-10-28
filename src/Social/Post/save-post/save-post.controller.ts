import { Controller, Get, Param, ParseIntPipe, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { SavePostService } from '@/Social/Post/save-post/save-post.service';

@ApiBearerAuth()
@ApiTags('Saves')
@Controller('save-post')
export class SavePostController {
    constructor(private readonly savePostService: SavePostService) {}

    @ApiOperation({ summary: 'Save a Post' })
    @ApiOkResponse({
        description: 'Successfully saved the post',
        schema: { example: { statusCode: 200, message: 'Post saved successfully' } },
    })
    @Post('/:postId/save')
    async savePost(
        @Param('postId', ParseIntPipe) postId: number,
        @Req() req: Request,
    ) {
        return await this.savePostService.savePost(postId, (req.user as any));
    }

    @ApiOperation({ summary: 'Get Saved Posts' })
    @ApiOkResponse({
        description: 'Returns a list of saved posts',
        schema: {
            example: {
                statusCode: 200,
                data: [
                    { postId: 1, title: 'First Post', content: 'Post content here...' },
                    { postId: 2, title: 'Another Post', content: 'More content here...' },
                ],
            },
        },
    })
    @Get()
    async getSavedPosts(
        @Req() req: Request,
    ) {
        return await this.savePostService.getSavedPosts((req.user as any));
    }
}
