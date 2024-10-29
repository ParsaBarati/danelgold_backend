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
import { PostService } from './posts.service';
import { Request } from 'express';
import { CreatePostDto } from './dto/createPost.dto';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UpdatePostDto } from './dto/updatePost.dto';
import { CommentService } from "@/Social/Comment/comment/comment.service";
import { CreateCommentDTO } from "@/Social/Comment/comment/dto/CreateComment";
import { JwtAuthGuard } from '@/User/auth/guards/jwt.guard';

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

    @UseGuards(JwtAuthGuard)
    @Post('Reel')
    @ApiOperation({ summary: 'Upload a new reel' })
    async uploadReel(
        @Body('mediaUrl') mediaUrl: string,
        @Body('caption') caption: string,
        @Req() req: Request
    ){
        return this.postService.uploadReel(mediaUrl, caption, (req.user as any));
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
