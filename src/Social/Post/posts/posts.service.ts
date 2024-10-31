import {Injectable, NotFoundException, UnauthorizedException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Post} from "./entity/posts.entity";
import {Repository} from "typeorm";
import {CreatePostDto} from "./dto/createPost.dto";
import {ApiResponses, createResponse} from "@/utils/response.util";
import {User} from "@/User/user/entity/user.entity";
import {UpdatePostDto} from "./dto/updatePost.dto";
import {PaginationService} from "@/common/paginate/pagitnate.service";
import {likePost} from "@/Social/Post/like-post/entity/like-post.entity";
import {FollowUser} from "@/Social/Follow/entity/follow.entity";


@Injectable()
export class PostService {
    constructor(
        @InjectRepository(likePost)
        private likePostRepository: Repository<likePost>,
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(FollowUser)
        private readonly followUserRepository: Repository<FollowUser>,
        private readonly paginationService: PaginationService
    ) {
    }

    async createPost(
        user: User,
        createPostDto: CreatePostDto
    ): Promise<ApiResponses<Post>> {

        const {mediaUrl, caption} = createPostDto;

        if (!user) {
            throw new NotFoundException('User not found')
        }


        const media = mediaUrl.shift();
        const post = {
            mediaUrl: media,
            media: media,
            content: mediaUrl   ,
            caption,
            user,
            userId: user.id,
            createdAt: new Date()
        }

        const savedPost = await this.postRepository.save(post)

        const response = {
            id: savedPost.id,
            mediaUrl: savedPost.mediaUrl,
            createdAt: savedPost.createdAt,
            updatedAt: savedPost.updatedAt,
            likes: savedPost.likes,
            dislikes: savedPost.dislikes,
            user: {
                username: user.username
            }
        };

        return createResponse(201, savedPost)
    }

    async updatePost(
        postId: number,
        currentUserIdentifier: string,
        updatePostDto: UpdatePostDto
    ): Promise<ApiResponses<Post>> {

        const post = await this.postRepository.findOneBy({id: postId})

        if (!post) {
            throw new NotFoundException('پست یافت نشد')
        }

        if (post.user.phone !== currentUserIdentifier && post.user.email !== currentUserIdentifier) {
            throw new UnauthorizedException('شما مجاز به ویرایش پست نیستید')
        }

        post.mediaUrl = updatePostDto.mediaUrl;
        post.caption = updatePostDto.caption;

        post.updatedAt = new Date();

        const updatedPost = await this.postRepository.save(post)

        return createResponse(200, updatedPost)
    }

    async deletePost(
        postId: number,
        currentUserIdentifier: string
    ): Promise<{ message: string }> {

        const post = await this.postRepository.findOneBy({id: postId});

        if (!post) {
            throw new NotFoundException('پست یافت نشد')
        }

        if (post.user.phone !== currentUserIdentifier && post.user.email !== currentUserIdentifier) {
            throw new UnauthorizedException('شما مجاز به حذف پست نیستید')
        }

        await this.postRepository.remove(post)

        return {message: 'با موفقیت حذف گردید'}
    }

    async getPostsByUser(
        Identifier: string,
        postId?: number
    ): Promise<ApiResponses<any>> {

        const queryBuilder = this.postRepository
            .createQueryBuilder('posts')
            .leftJoinAndSelect('posts.comment', 'comment')
            .leftJoinAndSelect('posts.postLikes', 'postLikes')
            .select([
                'posts.id',
                'posts.mediaUrl',
                'posts.caption',
                'posts.createdAt',
                'posts.updatedAt',
                'posts.likes',
                'posts.dislikes',
            ])
            .where('posts.userIdentifier = :Identifier', {Identifier});

        if (postId) {
            queryBuilder.andWhere('posts.id = :postId', {postId});
        }

        const posts = await queryBuilder.getMany();

        return createResponse(200, posts)
    }

    async getAllPosts(user: User): Promise<any> {
        // Fetch the list of user IDs that the current user follows
        const followingIds = await this.followUserRepository
            .createQueryBuilder('follow')
            .select('follow.followingId')
            .where('follow.followerId = :userId', {userId: user.id})
            .getRawMany();

        const followingUserIds = followingIds.map(follow => follow.followingId);

        // Modify the query to fetch posts only from users the current user follows
        const queryBuilder = this.postRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.user', 'user')
            .select([
                'post.id',
                'post.mediaUrl',
                'post.caption',
                'user.id',
                'user.name',
                'user.profilePic',
                'user.username',
                'user.email',
                'user.phone',
            ])
            .where('user.id IN (:...followingUserIds)', {followingUserIds})
            .orderBy('post.createdAt', 'DESC');

        const posts = await queryBuilder.getMany();

        const transformedPosts = posts.map((post) => ({
            id: post.id,
            img: post.mediaUrl,
            caption: post.caption,
            user: {
                id: post.user.id,
                name: post.user.name,
                pic: post.user.profilePic,
                username: post.user.username,
                email: post.user.email,
                phone: post.user.phone,
            },
        }));

        return {posts: transformedPosts};
    }

    async getExplorer(query: any, user: User): Promise<any> {
        const {page, limit} = query;

        // Fetch the list of user IDs that the current user follows
        // const followingIds = await this.followUserRepository
        //     .createQueryBuilder('follow')
        //     .select('follow.followingId')
        //     .where('follow.followerId = :userId', {userId: user.id})
        //     .getRawMany();
        //
        // console.log('followingUserIds')
        // console.log(followingIds)
        // const followingUserIds = followingIds.map(follow => follow.follow_followingId);
        // if (followingUserIds.length === 0) {
        //     // Return an empty result if the user is not following anyone
        //     return {
        //         currentPage: page,
        //         totalPages: 0,
        //         totalPosts: 0,
        //         posts: [],
        //     };
        // }

        // Modify the query to fetch posts only from users the current user follows
        const queryBuilder = this.postRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.user', 'user')
            .select([
                'post.id',
                'post.mediaUrl',
                'post.caption',
                'post.likes',
                'post.dislikes',
                'post.shares',
                'user.id',
                'user.name',
                'user.profilePic',
                'user.username',
                'post.createdAt',
                'post.media',
                'post.content',
            ])
            // .where('user.id IN (:...followingUserIds)', {followingUserIds})
            .groupBy('post.id, user.id')
            .orderBy('post.createdAt', 'DESC');

        const paginationResult = await this.paginationService.paginate(
            queryBuilder,
            page,
            limit,
        );

        const finalPosts = [];
        for (const post of paginationResult.data) {
            let existingLike = await this.likePostRepository.findOne({
                where: {post: {id: post.id}, user: {id: post.user.id}},
            });
            let existingSave = await this.likePostRepository.findOne({
                where: {post: {id: post.id}, user: {id: post.user.id}},
            });
            finalPosts.push({
                content: post.content,
                media: post.media,
                id: post.id,
                user: {
                    id: post.user.id,
                    name: post.user.name,
                    pic: post.user.profilePic,
                    username: post.user.username,
                },
                caption: post.caption,
                img: post.media,
                likes: post.likes,
                dislikes: post.dislikes,
                commentsCount: 0,
                sharesCount: post.shares,
                comments: [],
                createdAt: post.createdAt,
                isLiked: (!!existingLike && existingLike.isLike == 1),
                isDisliked: (!!existingLike && existingLike.isLike == -1),
                isSaved: (!!existingSave),
            });
        }

        return {
            currentPage: paginationResult.page,
            totalPages: paginationResult.totalPages,
            totalPosts: paginationResult.total,
            posts: finalPosts,
        };
    }


}