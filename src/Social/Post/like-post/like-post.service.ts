import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Post} from '@/Social/Post/posts/entity/posts.entity';
import {likePost} from '@/Social/Post/like-post/entity/like-post.entity';
import {User} from '@/User/user/entity/user.entity';
import { NotificationService } from '@/Social/Notification/notification.service';
import { NotificationAction } from '@/Social/Notification/entity/notification.entity';

@Injectable()
export class LikePostService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(likePost)
        private readonly likePostRepository: Repository<likePost>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly notificationService: NotificationService
    ) {
    }

    async likePost(
        postId: number,
        user: User,
    ): Promise<{ isLike: number }> {
    
        const likablePost = await this.postRepository.findOneBy({ id: postId });
    
        if (!likablePost) {
            throw new NotFoundException('Post not found!');
        }
    
        if (!user) {
            throw new NotFoundException('User not found');
        }
    
        let existingLike = await this.likePostRepository.findOne({
            where: { post: { id: postId }, user: { id: user.id } },
        });
    
        let isLikeChangedToPositive = false;
    
        if (!existingLike) {
            // Creating a new like
            existingLike = this.likePostRepository.create({
                post: likablePost,
                user,
                isLike: 1,
            });
            likablePost.likes++;
            isLikeChangedToPositive = true;
        } else {
            if (existingLike.isLike === 1) {
                // Removing an existing like
                existingLike.isLike = 0;
                likablePost.likes--;
            } else if (existingLike.isLike === -1) {
                // Changing dislike to like
                existingLike.isLike = 1;
                likablePost.likes++;
                likablePost.dislikes--;
                isLikeChangedToPositive = true;
            } else {
                // Changing neutral to like
                existingLike.isLike = 1;
                likablePost.likes++;
                isLikeChangedToPositive = true;
            }
        }
    
        // Save changes to like and post
            await this.likePostRepository.save(existingLike);
            await this.postRepository.save(likablePost);
        
    
        // Send notification if a new like was added or a dislike changed to like
        if (isLikeChangedToPositive && likablePost.user.id !== user.id) {
            await this.notificationService.sendNotification(
                likablePost.user.id,         // Recipient: post owner
                NotificationAction.LIKE,     // Action type: 'like'
                `Your post was liked by ${user.username}`, // Notification title
                user.profilePic,      // Thumbnail, e.g., liker’s profile picture
                user.id                      // Sender: the user who liked the post
            );
        }
    
        return { isLike: existingLike.isLike };
    }
    
    async dislikePost(
        postId: number,
        user: User,
    ): Promise<{ isDislike: number }> {

        const dislikablePost = await this.postRepository.findOneBy(
            {id: postId}
        );

        if (!dislikablePost) {
            throw new NotFoundException('کامنتی پیدا نشد!');
        }


        if (!user) {
            throw new NotFoundException('User not found');
        }

        let existingDislike = await this.likePostRepository.findOne({
            where: {post: {id: postId}, user: {id: user.id}},
        });

        if (!existingDislike) {
            existingDislike = this.likePostRepository.create({
                post: dislikablePost,
                user,
                isLike: -1,
            });
            dislikablePost.dislikes++;
        } else {
            if (existingDislike.isLike === -1) {
                existingDislike.isLike = 0;
                dislikablePost.dislikes--;
            } else if (existingDislike.isLike === 1) {
                existingDislike.isLike = -1;
                dislikablePost.dislikes++;
                dislikablePost.likes--;
            } else {
                existingDislike.isLike = -1;
                dislikablePost.dislikes++;
            }
        }

        try {

            await this.likePostRepository.save(existingDislike);
            await this.postRepository.save(dislikablePost);
        } catch (e) {

        }

        return {isDislike: existingDislike.isLike};
    }
}
