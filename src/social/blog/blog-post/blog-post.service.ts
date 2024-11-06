import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogPost } from './entity/blog-post.entity';
import { BlogCategory } from '../blog-catagory/entity/blog-catagory.entity';
import { PaginationService } from '@/common/paginate/pagitnate.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { ApiResponses, createResponse } from '@/utils/response.util';

@Injectable()
export class BlogPostService {
    constructor(
        @InjectRepository(BlogPost)
        private blogPostRepository: Repository<BlogPost>,
        @InjectRepository(BlogCategory)
        private blogCategoryRepository: Repository<BlogCategory>,
        private paginationService: PaginationService,
    ) {}

    async createBlogPost(
        createBlogPostDto: CreateBlogPostDto
    ): Promise<ApiResponses<BlogPost>> {

        const blogPost = this.blogPostRepository.create(createBlogPostDto);

        const savedBlogPost = await this.blogPostRepository.save(blogPost);

        return createResponse(201,savedBlogPost)
    }

    async updateBlogPost(
        id: number, 
        updateBlogPostDto: UpdateBlogPostDto
    ): Promise<ApiResponses<BlogPost>> {
        
        const blogPost = await this.blogPostRepository.preload({
            id,
            ...updateBlogPostDto,
        });

        if (!blogPost) {
            throw new NotFoundException(`BlogPost with ID ${id} not found`);
        }

        const updatedBlogPost = await this.blogPostRepository.save(blogPost);

        return createResponse(200,updatedBlogPost)
    }

    async removeBlogPost(
        id: number
    ): Promise<{ message : string }> {

        const result = await this.blogPostRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`BlogPost with ID ${id} not found`);
        }

        return { message: 'BlogPost Deleted Successfully' }
    }

    async getBlogPosts(
        page: number, 
        limit: number, 
        categoryId?: number
    ) {
        const query = this.blogPostRepository.createQueryBuilder('post')
            .leftJoinAndSelect('post.author', 'author')
            .leftJoinAndSelect('post.category', 'category');

        if (categoryId) {
            query.andWhere('post.categoryId = :categoryId', { categoryId });
        }

        const paginationResult = await this.paginationService.paginate(query, page, limit);
        const categories = await this.blogCategoryRepository.find();

        return {
            blogPosts: paginationResult.data,
            categories: categories.map(cat => ({ id: cat.id, name: cat.name })),
            pagination: {
                currentPage: paginationResult.page,
                totalPages: paginationResult.totalPages,
                pageSize: paginationResult.limit,
                totalItems: paginationResult.total,
            }
        };
    }
}
