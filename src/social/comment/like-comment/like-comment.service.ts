import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment } from "@/social/comment/comment/entity/comment.entity";
import { Repository } from "typeorm";
import { likeComment } from "@/social/comment/like-comment/entity/like-comment.entity";
import { User } from "@/user/user/entity/user.entity";

@Injectable()
export class LikeCommentService{
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
        @InjectRepository(likeComment)
        private readonly likeRepository: Repository<likeComment>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

      ) {}
    
    async likeComment(
        commentId: number, 
        userIdentifier: string, 
      ): Promise<{ isLike: number }> {
        
        const likableComment = await this.commentRepository.findOneBy(
          {id: commentId}
        );
    
        if (!likableComment) {
            throw new NotFoundException('کامنتی پیدا نشد!');
        }

        const user = await this.userRepository.findOne({
            where: [{ phone: userIdentifier },{ email: userIdentifier }]
        })
    
        let existingLike = await this.likeRepository.findOne({
            where: { comment: { id: commentId }, user : { id: user.id } },
        });
    
        if (!existingLike) {
            existingLike = this.likeRepository.create({
                comment: likableComment,
                user,
                isLike: 1,
            });
            likableComment.likes++;
        } else {
            if (existingLike.isLike === 1) {
                existingLike.isLike = 0;
                likableComment.likes--;
            } else if (existingLike.isLike === -1) {
                existingLike.isLike = 1;
                likableComment.likes++;
                likableComment.dislikes--;
            } else {
                existingLike.isLike = 1;
                likableComment.likes++;
            }
        }
    
        await this.likeRepository.save(existingLike);
        await this.commentRepository.save(likableComment);
    
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