import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment } from "@/Social/Comment/comment/entity/comment.entity";
import { Repository } from "typeorm";
import { likeComment } from "./entity/like-comment.entity";
import { User } from "@/User/user/entity/user.entity";
import { NotificationService } from "@/Social/Notification/notification.service";
import { NotificationAction } from "@/Social/Notification/entity/notification.entity";

@Injectable()
export class LikeCommentService{
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
        @InjectRepository(likeComment)
        private readonly likeRepository: Repository<likeComment>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly notificationService: NotificationService

      ) {}
    
      async likeComment(
        commentId: number,
        userIdentifier: string,
    ): Promise<{ isLike: number }> {
    
        const likableComment = await this.commentRepository.findOneBy({ id: commentId });
    
        if (!likableComment) {
            throw new NotFoundException('کامنتی پیدا نشد!');
        }
    
        const user = await this.userRepository.findOne({
            where: [{ phone: userIdentifier }, { email: userIdentifier }]
        });
    
        if (!user) {
            throw new NotFoundException('User not found');
        }
    
        let existingLike = await this.likeRepository.findOne({
            where: { comment: { id: commentId }, user: { id: user.id } },
        });
    
        let isLikeChangedToPositive = false;
    
        if (!existingLike) {
            // Creating a new like for the comment
            existingLike = this.likeRepository.create({
                comment: likableComment,
                user,
                isLike: 1,
            });
            likableComment.likes++;
            isLikeChangedToPositive = true; // Indicates a new like
        } else {
            if (existingLike.isLike === 1) {
                // Removing an existing like
                existingLike.isLike = 0;
                likableComment.likes--;
            } else if (existingLike.isLike === -1) {
                // Changing dislike to like
                existingLike.isLike = 1;
                likableComment.likes++;
                likableComment.dislikes--;
                isLikeChangedToPositive = true; // Indicates a change to a positive like
            } else {
                // Changing neutral to like
                existingLike.isLike = 1;
                likableComment.likes++;
                isLikeChangedToPositive = true; // Indicates a new like
            }
        }
    
        // Save changes to the like and comment
        await this.likeRepository.save(existingLike);
        await this.commentRepository.save(likableComment);
    
        // Send notification if a new like was added or a dislike changed to like
        if (isLikeChangedToPositive && likableComment.user.id !== user.id) {
            await this.notificationService.sendNotification(
                likableComment.user.id,               // Recipient: comment owner
                NotificationAction.LIKE,               // Action type: 'like'
                `Your comment was liked by ${user.username}`, // Notification title
                user.profilePic,                // Thumbnail, e.g., liker's profile picture
                user.id                                 // Sender: the user who liked the comment
            );
        }
    
        return { isLike: existingLike.isLike };
    }
    
    async dislikeComment(
      commentId: number, 
      userIdentifier: string, 
    ): Promise<{ isDislike: number }> {
        
        const dislikableComment = await this.commentRepository.findOneBy(
          {id: commentId}
        );
    
        if (!dislikableComment) {
            throw new NotFoundException('کامنتی پیدا نشد!');
        }

        const user = await this.userRepository.findOne({
            where: [{ phone: userIdentifier },{ email: userIdentifier }]
        })
    
        let existingLike = await this.likeRepository.findOne({
            where: { comment: { id: commentId }, user : { id: user.id } },
        });
    
        let existingDislike = await this.likeRepository.findOne({
            where: { comment: { id: commentId }, user: { id: user.id } },
        });
    
        if (!existingDislike) {
            existingDislike = this.likeRepository.create({
                comment: dislikableComment,
                user,
                isLike: -1,
            });
            dislikableComment.dislikes++;
        } else {
            if (existingDislike.isLike === -1) {
                existingDislike.isLike = 0;
                dislikableComment.dislikes--;
            } else if (existingDislike.isLike === 1) {
                existingDislike.isLike = -1;
                dislikableComment.dislikes++;
                dislikableComment.likes--;
            } else {
                existingDislike.isLike = -1;
                dislikableComment.dislikes++;
            }
        }
    
        await this.likeRepository.save(existingDislike);
        await this.commentRepository.save(dislikableComment);
    
        return { isDislike: existingDislike.isLike };
    }
}