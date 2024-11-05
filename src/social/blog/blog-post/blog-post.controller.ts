import { Controller, Get, Query } from '@nestjs/common';
import { BlogPostService } from './blog-post.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('BlogPost')
@Controller('blogPost')
export class BlogPostController {
    constructor(private readonly blogPostService: BlogPostService) {}

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
