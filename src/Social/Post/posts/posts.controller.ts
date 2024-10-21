import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req } from '@nestjs/common';
import { PostService } from './posts.service';
import { Request } from 'express';
import { CreatePostDto } from './dto/createPost.dto';
import { ApiBearerAuth, ApiExcludeController, ApiExcludeEndpoint, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UpdatePostDto } from './dto/updatePost.dto';

@ApiTags('Post')
@ApiBearerAuth()
@Controller('post')
export class PostsController {
    constructor( private readonly postService: PostService){}

    @ApiExcludeEndpoint()
    @Post()
    async createPost(
        @Req() req:Request,
        @Body() createPostDto: CreatePostDto
    ){
        const userIdentifier = (req.user as any).result.phone || (req.user as any).result.email;
        return await this.postService.createPost(userIdentifier,createPostDto)
    }

    @ApiExcludeEndpoint()
    @ApiOperation({ summary: 'UpdatePost' })
    @Put()
    async updatePost(
        @Param('postId',ParseIntPipe) postId: number,
        @Req() req:Request,
        @Body() updatePostDto: UpdatePostDto
    ){
        const currentUserIdentifier = (req.user as any).result.phone || (req.user as any).result.email;
        return await this.postService.updatePost(postId,currentUserIdentifier,updatePostDto)
    }

    @ApiExcludeEndpoint()
    @ApiOperation({ summary: 'DeletePost' })
    @Delete()
    async deletePost(
        @Param('postId',ParseIntPipe) postId: number,
        @Req() req:Request
    ){
        const currentUserIdentifier = (req.user as any).result.phone || (req.user as any).result.email;
        return await this.postService.deletePost(postId,currentUserIdentifier)
    }

    @ApiExcludeEndpoint()
    @ApiOperation({summary: 'GetUserCommentsOnPosts'})
    @Get('postComment')
    async getPostCommentsByUser(
       @Query('postId', new DefaultValuePipe(1), ParseIntPipe) postId: number | undefined,
       @Req() req: Request,
    ){
      const phone = (req.user as any).result.phone;
      return await this.postService.getPostsByUser(phone, postId);
    }

    @ApiOperation({ summary: 'getExplorerWithoutPaginate' })
    @Get('explorer')
    async getAllPosts() {
        return await this.postService.getAllPosts();
    }

    @ApiOperation({ summary: 'getExplorerWithPaginate' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @Get()
    async getExplorer(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ){
      const query = { page, limit };
      return this.postService.getExplorer(query);
    }
} 







