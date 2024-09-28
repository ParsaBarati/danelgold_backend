import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Story } from '../stories/entity/stories.entity';
import { likeStory } from './entity/like-story.entity';

@Injectable()
export class LikeStoryService {
    constructor(
        @InjectRepository(Story)
        private readonly storyRepository: Repository<Story>,
        @InjectRepository(likeStory)
        private readonly likeStoryRepository: Repository<likeStory>
    ){}

    async likeStory(
        storyId: number, 
        userPhone: string, 
      ): Promise<{ isLike: number }> {
        
        const likableStory = await this.storyRepository.findOneBy(
          {id: storyId}
        );
    
        if (!likableStory) {
            throw new NotFoundException('استوری پیدا نشد!');
        }
    
        let existingLike = await this.likeStoryRepository.findOne({
            where: { story: { id: storyId }, userPhone },
        });
    
        if (!existingLike) {
            existingLike = this.likeStoryRepository.create({
                story: likableStory,
                userPhone,
                isLike: 1,
            });
            likableStory.likes++;
        } else {
            if (existingLike.isLike === 1) {
                existingLike.isLike = 0;
                likableStory.likes--;
            } else if (existingLike.isLike === -1) {
                existingLike.isLike = 1;
                likableStory.likes++;
                likableStory.dislikes--;
            } else {
                existingLike.isLike = 1;
                likableStory.likes++;
            }
        }
    
        await this.likeStoryRepository.save(existingLike);
        await this.storyRepository.save(likableStory);
    
        return { isLike: existingLike.isLike };
    }
    
    async dislikeStory(
      storyId: number, 
      userPhone: string, 
    ): Promise<{ isDislike: number }> {
        
        const dislikableStory = await this.storyRepository.findOneBy(
          {id: storyId}
        );
    
        if (!dislikableStory) {
            throw new NotFoundException('کامنتی پیدا نشد!');
        }
    
        let existingDislike = await this.likeStoryRepository.findOne({
            where: { story: { id: storyId }, userPhone },
        });
    
        if (!existingDislike) {
            existingDislike = this.likeStoryRepository.create({
                story: dislikableStory,
                userPhone,
                isLike: -1,
            });
            dislikableStory.dislikes++;
        } else {
            if (existingDislike.isLike === -1) {
                existingDislike.isLike = 0;
                dislikableStory.dislikes--;
            } else if (existingDislike.isLike === 1) {
                existingDislike.isLike = -1;
                dislikableStory.dislikes++;
                dislikableStory.likes--;
            } else {
                existingDislike.isLike = -1;
                dislikableStory.dislikes++;
            }
        }
    
        await this.likeStoryRepository.save(existingDislike);
        await this.storyRepository.save(dislikableStory);
    
        return { isDislike: existingDislike.isLike };
    }
}
