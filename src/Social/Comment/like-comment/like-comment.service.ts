import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment } from "@/Social/Comment/comment/entity/comment.entity";
import { Repository } from "typeorm";
import { likeComment } from "./entity/like-comment.entity";

@Injectable()
export class LikeCommentService{
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
        @InjectRepository(likeComment)
        private readonly likeRepository: Repository<likeComment>,
      ) {}
    
    async likeComment(
        commentId: number, 
        userPhone: string, 
      ): Promise<{ isLike: number }> {
        
        const likableComment = await this.commentRepository.findOneBy(
          {id: commentId}
        );
    
        if (!likableComment) {
            throw new NotFoundException('کامنتی پیدا نشد!');
        }
    
        let existingLike = await this.likeRepository.findOne({
            where: { comment: { id: commentId }, userPhone },
        });
    
        if (!existingLike) {
            existingLike = this.likeRepository.create({
                comment: likableComment,
                userPhone,
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
      userPhone: string, 
    ): Promise<{ isDislike: number }> {
        
        const dislikableComment = await this.commentRepository.findOneBy(
          {id: commentId}
        );
    
        if (!dislikableComment) {
            throw new NotFoundException('کامنتی پیدا نشد!');
        }
    
        let existingDislike = await this.likeRepository.findOne({
            where: { comment: { id: commentId }, userPhone },
        });
    
        if (!existingDislike) {
            existingDislike = this.likeRepository.create({
                comment: dislikableComment,
                userPhone,
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