import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Post} from '@/social/post/posts/entity/posts.entity';
import {likePost} from '@/social/post/like-post/entity/like-post.entity';
import {User} from '@/user/user/entity/user.entity';
import {savePost} from "@/social/post/save-post/entity/save-post.entity";

@Injectable()
export class SavePostService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(likePost)
        private readonly likePostRepository: Repository<likePost>,
        @InjectRepository(savePost)
        private savePostRepository: Repository<savePost>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
    }

    async savePost(
        postId: number,
        user: User,
    ): Promise<{ saves: number }> {

        const saveblePost = await this.postRepository.findOneBy(
            {id: postId}
        );

        if (!saveblePost) {
            throw new NotFoundException('Post not found!');
        }


        if (!user) {
            throw new NotFoundException('User not found');
        }

        let existingSave = await this.savePostRepository.findOne({
            where: {post: {id: postId}, user: {id: user.id}},
        });
        console.log(existingSave)

        if (!existingSave) {
            console.log(postId, user)
            const save = await this.savePostRepository.create({
                postId: postId,
                userId: user.id,
            });
            console.log(save)
            await this.savePostRepository.save(save);

            saveblePost.saves++;
        } else {
            await this.savePostRepository.remove(existingSave);
            saveblePost.saves--;
        }

        try {
            await this.postRepository.save(saveblePost);
        } catch (e) {
            console.info(e)
        }

        return {saves: saveblePost.saves};
    }

    async getSavedPosts(user: User): Promise<any[]> {
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Preload the saved posts with related user and post data, along with likes and saves
        const savedPosts = await this.savePostRepository.find({
            where: {user: {id: user.id}},
            relations: ['post', 'post.user', 'post.postLikes'],
        });

        return savedPosts.map(savedPost => {
            const post = savedPost.post;

            // Check if the user liked or disliked the post
            const userLike = post.postLikes.find(function (like) {
                console.log(like)
                return like.userId === user.id;
            });
            const isLiked = !!userLike && userLike.isLike === 1;
            const isDisliked = !!userLike && userLike.isLike === -1;

            // Check if the user has saved the post

            return {
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
                img: post.mediaUrl,
                likes: post.likes,
                dislikes: post.dislikes,
                commentsCount: 0,
                sharesCount: post.shares,
                comments: [], // Populate this with actual comments if needed
                createdAt: post.createdAt,
                isLiked,
                isDisliked,
                isSaved: true,
            };
        });
    }

}
