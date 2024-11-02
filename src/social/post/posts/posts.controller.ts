import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    Req,
    UseGuards
} from '@nestjs/common';
import { Request } from 'express';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CommentService } from "@/social/comment/comment/comment.service";
import { CreateCommentDTO } from "@/social/comment/comment/dto/CreateComment";
import { PostService } from '@/social/post/posts/posts.service';
import { CreatePostDto } from '@/social/post/posts/dto/createPost.dto';
import { UpdatePostDto } from '@/social/post/posts/dto/updatePost.dto';

@ApiTags('Post')
@ApiBearerAuth()
@Controller('post')
export class PostsController {
    constructor(
        private readonly postService: PostService,
        private readonly commentsService: CommentService,
    ) {}

    @ApiOperation({ summary: 'Create Post' })
    @Post()
    async createPost(
        @Req() req: Request,
        @Body() createPostDto: CreatePostDto
    ) {
        return await this.postService.createPost(req.user as any, createPostDto);
    }

    @ApiOperation({ summary: 'Update Post' })
    @Put('/:postId')
    async updatePost(
        @Param('postId', ParseIntPipe) postId: number,
        @Req() req: Request,
        @Body() updatePostDto: UpdatePostDto
    ) {
        const currentUserIdentifier = (req.user as any).phone || (req.user as any).email;
        return await this.postService.updatePost(postId, currentUserIdentifier, updatePostDto);
    }

    @ApiExcludeEndpoint()
    @Delete('/:postId')
    async deletePost(
        @Param('postId', ParseIntPipe) postId: number,
        @Req() req: Request
    ) {
        const currentUserIdentifier = (req.user as any).phone || (req.user as any).email;
        return await this.postService.deletePost(postId, currentUserIdentifier);
    }

    @ApiOperation({ summary: 'Get User Comments on Posts' })
    @Get('postComment')
    async getPostCommentsByUser(
        @Query('postId', new DefaultValuePipe(1), ParseIntPipe) postId: number | undefined,
        @Req() req: Request,
    ) {
        const phone = (req.user as any).phone;
        return await this.postService.getPostsByUser(phone, postId);
    }

    @ApiOperation({ summary: 'Get Explorer Without Pagination' })
    @Get('explorer')
    async getAllPosts(
        @Req() req: Request
    ) {
        return await this.postService.getAllPosts(req.user as any);
    }

    @ApiOperation({ summary: 'Get Explorer with Pagination' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @Get('/explore')
    async getExplorer(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Req() req: Request
    ) {
        const query = { page, limit };
        return this.postService.getExplorer(query, req.user as any);
    }

    @ApiOperation({ summary: 'Get Comments on a Post' })
    @Get("/comments/:postId")
    async comments(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Param('postId', ParseIntPipe) postId: number,
        @Req() req: Request,
    ) {
        const query = { page, limit };
        return this.commentsService.getCommentsByPost(postId, req.user as any, query);
    }

    @ApiOperation({ summary: 'Add Comment to a Post' })
    @Post("/comment/:postId")
    async addCommentToPost(
        @Param('postId', ParseIntPipe) postId: number,
        @Req() req: Request,
        @Body() createCommentDTO: CreateCommentDTO,
    ) {
        return await this.commentsService.CommentPost(postId, req.user as any, createCommentDTO);
    }
}
