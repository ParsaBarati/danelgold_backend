import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogPost } from './entity/blog-post.entity';
import { BlogCategory } from '../blog-catagory/entity/blog-catagory.entity';
import { PaginationService } from '@/common/paginate/pagitnate.service';

@Injectable()
export class BlogPostService {
    constructor(
        @InjectRepository(BlogPost)
        private blogPostRepository: Repository<BlogPost>,
        @InjectRepository(BlogCategory)
        private blogCategoryRepository: Repository<BlogCategory>,
        private paginationService: PaginationService,
    ) {}

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
