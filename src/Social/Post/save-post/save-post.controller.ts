import {Controller, Get, Param, ParseIntPipe, Post, Req} from '@nestjs/common';
import {ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags} from '@nestjs/swagger';
import {Request} from 'express';
import {User} from "@/User/user/entity/user.entity";
import {SavePostService} from "@/Social/Post/save-post/save-post.service";

// @ApiExcludeController()
@ApiBearerAuth()
@ApiTags('saves')
@Controller('save-post')
export class SavePostController {
    constructor(private readonly savePostService: SavePostService) {
    }

    @ApiOperation({summary: 'Save Post'})
    @ApiOkResponse({description: 'Saved', example: {statusCode: 200}})
    @Post('/:postId/save')
    async savePost(
        @Param('postId', ParseIntPipe) postId: number,
        @Req() req: Request,
    ) {

        return await this.savePostService.savePost(postId, (req.user as any));
    }

    @ApiOperation({summary: 'Saved Posts'})
    @ApiOkResponse({description: 'List', example: {statusCode: 200}})
    @Get()
    async getSavedPosts(
        @Req() req: Request,
    ) {

        return await this.savePostService.getSavedPosts((req.user as any));
    }


}
