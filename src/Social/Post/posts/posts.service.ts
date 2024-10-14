import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Post } from "./entity/posts.entity";
import { Repository } from "typeorm";
import { CreatePostDto } from "./dto/createPost.dto";
import { ApiResponses, createResponse } from "@/utils/response.util";
import { User } from "@/User/user/entity/user.entity";
import { UpdatePostDto } from "./dto/updatePost.dto";
import { PaginationService } from "@/common/paginate/pagitnate.service";


@Injectable()
export class PostService{
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly paginationService: PaginationService
    ){}

    async createPost(
        userPhone: string,
        createPostDto:CreatePostDto
    ):Promise<ApiResponses<Post>>{

        const { mediaUrl, caption } = createPostDto;

        const user = await this.userRepository.findOne({
            where: {phone: userPhone}
        })

        if(!user){
            throw new NotFoundException('کاربر یافت نشد')
        }

        const post = {
            mediaUrl,
            caption,
            user,
            createdAt : new Date()
        }

        const savedPost = await this.postRepository.save(post)

        return createResponse(201,savedPost)
    }

    async updatePost(
        postId: number,
        currentUserPhone: string, 
        updatePostDto: UpdatePostDto
    ):Promise<ApiResponses<Post>>{

        const post = await this.postRepository.findOneBy({ id: postId })

        if(!post){
            throw new NotFoundException('پست یافت نشد')
        }

        if(post.userPhone !== currentUserPhone){
            throw new UnauthorizedException('شما مجاز به ویرایش پست نیستید')
        }

        post.mediaUrl = updatePostDto.mediaUrl;
        post.caption = updatePostDto.caption;

        post.updatedAt = new Date();

        const updatedPost = await this.postRepository.save(post)

        return createResponse(200,updatedPost)
    }

    async deletePost(
        postId: number,
        currentUserPhone: string
    ):Promise<{message: string}>{

        const post = await this.postRepository.findOneBy({ id: postId });

        if(!post){
            throw new NotFoundException('پست یافت نشد')
        }

        if(post.userPhone !== currentUserPhone){
            throw new UnauthorizedException('شما مجاز به حذف پست نیستید')
        }

        await this.postRepository.remove(post)

        return { message : 'با موفقیت حذف گردید'}
    }

    async getPostsByUser(
        phone: string,
        postId?: number
    ):Promise<ApiResponses<any>>{

        const queryBuilder = this.postRepository
          .createQueryBuilder('posts')
          .leftJoinAndSelect('posts.comment','comment')
          .leftJoinAndSelect('posts.postLikes','postLikes')
          .select([
            'posts.id',
            'posts.mediaUrl',
            'posts.caption',
            'posts.createdAt',
            'posts.updatedAt',
            'posts.likes',
            'posts.dislikes',
          ])
          .where('posts.userPhone = :phone', { phone });

          if (postId) {
            queryBuilder.andWhere('posts.id = :postId', { postId });
          }

          const posts = await queryBuilder.getMany();
          
          return createResponse(200,posts)
    }

    async getExplorer(query: any): Promise<any> {

        const { page, limit } = query

        const queryBuilder = this.postRepository
          .createQueryBuilder('post')
          .leftJoinAndSelect('post.user', 'user') 
          .select([
            'post.id',
            'post.mediaUrl',
            'post.caption',
            'user.id',
            'user.name',
            'user.pic',
            'user.username',
            'user.email',
            'user.phone',
          ])
          .orderBy('post.createdAt', 'DESC'); 
    
        const paginationResult = await this.paginationService.paginate(
          queryBuilder,
          page,
          limit,
        );
    
        const transformedPosts = paginationResult.data.map((post) => ({
          id: post.id,
          img: post.mediaUrl,
          caption: post.caption,
          user: {
            id: post.user.id,
            name: post.user.username,
            pic: post.user.profilePic,
            username: post.user.username,
            email: post.user.email,
            phone: post.user.phone,
          },
        }));
    
        return {
          posts: transformedPosts,
          total: paginationResult.total,
          page: paginationResult.page,
          limit: paginationResult.limit,
          totalPages: paginationResult.totalPages,
        };
    }
}