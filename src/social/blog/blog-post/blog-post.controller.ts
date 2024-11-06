import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { BlogPostService } from './blog-post.service';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';

@ApiTags('BlogPost')
@ApiBearerAuth()
@Controller('blogPost')
export class BlogPostController {
    constructor(private readonly blogPostService: BlogPostService) {}


    @ApiOperation({ summary: 'Create Blog Post' })
    @Post()
    createBlogPost(
        @Body() createBlogPostDto: CreateBlogPostDto
    ){
        return this.blogPostService.createBlogPost(createBlogPostDto);
    }

    @ApiOperation({ summary: 'Update Blog Post' })
    @Patch('/:id')
    updateBlogPost(
        @Param('id',ParseIntPipe) id: number,
        @Body() updateBlogPostDto: UpdateBlogPostDto
    ){
        return this.blogPostService.updateBlogPost(id, updateBlogPostDto);
    }

    @ApiOperation({ summary: 'Delete Blog Post' })
    @Delete('/:id')
    removeBlogPost(
        @Param('id',ParseIntPipe) id: number
    ){
        return this.blogPostService.removeBlogPost(id);
    }


    @ApiOperation({ summary: 'Get Blog Data base on APi' })
    @ApiQuery({ name: 'page', required: true , type: Number })
    @ApiQuery({ name: 'limit', required: true, type: Number })
    @ApiQuery({ name: 'catagoryId', required: false, type: Number })
    @Get()
    async getBlogPosts(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('categoryId') categoryId?: number
    ) {
        return this.blogPostService.getBlogPosts(page, limit, categoryId);
    }
}
