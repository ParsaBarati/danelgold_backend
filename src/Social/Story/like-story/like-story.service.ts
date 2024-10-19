import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Story } from '../stories/entity/stories.entity';
import { likeStory } from './entity/like-story.entity';
import { User } from '@/User/user/entity/user.entity';
import { use } from 'passport';

@Injectable()
export class LikeStoryService {
    constructor(
        @InjectRepository(Story)
        private readonly storyRepository: Repository<Story>,
        @InjectRepository(likeStory)
        private readonly likeStoryRepository: Repository<likeStory>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

    ){}

    async likeStory(
        storyId: number, 
        userIdentifier: string, 
      ): Promise<{ isLike: number }> {
        
        const likableStory = await this.storyRepository.findOneBy(
          {id: storyId}
        );
    
        if (!likableStory) {
            throw new NotFoundException('استوری پیدا نشد!');
        }

        const user = await this.userRepository.findOne({
            where: [{ phone: userIdentifier }, { email: userIdentifier }]
        });
    
        if (!user) {
            throw new NotFoundException('کاربر یافت نشد');
        }
    
        let existingLike = await this.likeStoryRepository.findOne({
            where: { story: { id: storyId }, user : { id: user.id } },
        });
    
        if (!existingLike) {
            existingLike = this.likeStoryRepository.create({
                story: likableStory,
                user,
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
      userIdentifier: string, 
    ): Promise<{ isDislike: number }> {
        
        const dislikableStory = await this.storyRepository.findOneBy(
          {id: storyId}
        );
    
        if (!dislikableStory) {
            throw new NotFoundException('کامنتی پیدا نشد!');
        }

        const user = await this.userRepository.findOne({
            where: [{ phone: userIdentifier }, { email: userIdentifier }]
        })

        if(!user){
            throw new NotFoundException('کاربر یافت نشد')
        }
    
        let existingDislike = await this.likeStoryRepository.findOne({
            where: { story: { id: storyId }, user: { id: user.id } },
        });
    
        if (!existingDislike) {
            existingDislike = this.likeStoryRepository.create({
                story: dislikableStory,
                user,
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
