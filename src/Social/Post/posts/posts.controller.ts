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
    Req
} from '@nestjs/common';
import {PostService} from './posts.service';
import {Request} from 'express';
import {CreatePostDto} from './dto/createPost.dto';
import {ApiBearerAuth, ApiExcludeEndpoint, ApiOperation, ApiQuery, ApiTags} from '@nestjs/swagger';
import {UpdatePostDto} from './dto/updatePost.dto';
import {CommentService} from "@/Social/Comment/comment/comment.service";
import {CreateCommentDTO} from "@/Social/Comment/comment/dto/CreateComment";

@ApiTags('Post')
@ApiBearerAuth()
@Controller('post')
export class PostsController {
    constructor(private readonly postService: PostService, private readonly commentsService: CommentService,) {
    }

    @ApiOperation({summary: 'Create Post'})
    @Post()
    async createPost(
        @Req() req: Request,
        @Body() createPostDto: CreatePostDto
    ) {
        const userIdentifier = (req.user as any).phone || (req.user as any).email;
        return await this.postService.createPost(userIdentifier, createPostDto)
    }

    @ApiOperation({summary: 'UpdatePost'})
    @Put()
    async updatePost(
        @Param('postId', ParseIntPipe) postId: number,
        @Req() req: Request,
        @Body() updatePostDto: UpdatePostDto
    ) {
        const currentUserIdentifier = (req.user as any).phone || (req.user as any).email;
        return await this.postService.updatePost(postId, currentUserIdentifier, updatePostDto)
    }

    @ApiExcludeEndpoint()
    @ApiOperation({summary: 'DeletePost'})
    @Delete()
    async deletePost(
        @Param('postId', ParseIntPipe) postId: number,
        @Req() req: Request
    ) {
        const currentUserIdentifier = (req.user as any).phone || (req.user as any).email;
        return await this.postService.deletePost(postId, currentUserIdentifier)
    }

    @ApiExcludeEndpoint()
    @ApiOperation({summary: 'GetUserCommentsOnPosts'})
    @Get('postComment')
    async getPostCommentsByUser(
        @Query('postId', new DefaultValuePipe(1), ParseIntPipe) postId: number | undefined,
        @Req() req: Request,
    ) {
        const phone = (req.user as any).phone;
        return await this.postService.getPostsByUser(phone, postId);
    }

    @ApiOperation({summary: 'getExplorerWithoutPaginate'})
    @Get('explorer')
    async getAllPosts() {
        return await this.postService.getAllPosts();
    }

    @ApiOperation({summary: 'getExplorerWithPaginate'})
    @ApiQuery({name: 'page', required: false})
    @ApiQuery({name: 'limit', required: false})
    @Get('/explore')
    async getExplorer(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ) {
        const query = {page, limit};
        return this.postService.getExplorer(query);
    }

    @ApiOperation({summary: 'comments'})
    @Get("/comments/:postId")
    async comments(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Param('postId', ParseIntPipe) postId: number,
        @Req() req: Request,
    ) {
        const query = {page, limit};

        return this.commentsService.getCommentsByPost(postId, (req.user as any), query);
    }

    @ApiOperation({summary: 'comments post'})
    @Post("/comment/:postId")
    async comment(
        @Param('postId', ParseIntPipe) postId: number,
        @Req() req: Request,
        @Body() createCommentDTO: CreateCommentDTO,
    ) {
        return await this.commentsService.CommentPost(postId, (req.user as any), createCommentDTO);
    }
} 







