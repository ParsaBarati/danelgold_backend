import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Story} from '../stories/entity/stories.entity';
import {likeStory} from './entity/like-story.entity';
import {User} from '@/User/user/entity/user.entity';
import { NotificationService } from '@/Social/Notification/notification.service';
import { NotificationAction } from '@/Social/Notification/entity/notification.entity';

@Injectable()
export class LikeStoryService {
    constructor(
        @InjectRepository(Story)
        private readonly storyRepository: Repository<Story>,
        @InjectRepository(likeStory)
        private readonly likeStoryRepository: Repository<likeStory>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly notificationService: NotificationService
    ) {
    }

    async likeStory(
        storyId: number,
        user: User,
    ): Promise<{ isLiked: boolean }> {
    
        const likableStory = await this.storyRepository.findOneBy({ id: storyId });
    
        if (!likableStory) {
            throw new NotFoundException('Story not found!');
        }
    
        if (!user) {
            throw new NotFoundException('User not found');
        }
    
        let existingLike = await this.likeStoryRepository.findOne({
            where: { story: { id: storyId }, user: { id: user.id } },
        });
    
        let isLiked = false;
    
        if (!existingLike) {
            // Creating a new like for the story
            existingLike = this.likeStoryRepository.create({
                story: likableStory,
                user,
            });
            likableStory.likes++;
            await this.likeStoryRepository.save(existingLike);
            isLiked = true; // Indicates that the story is now liked
    
            // Send notification to the story owner
            if (likableStory.user.id !== user.id) {
                await this.notificationService.sendNotification(
                    likableStory.user.id,           // Recipient: story owner
                    NotificationAction.LIKE,        // Action type: 'like'
                    `Your story was liked by ${user.username}`, // Notification title
                    user.profilePic,         // Thumbnail, e.g., liker’s profile picture
                    user.id                         // Sender: the user who liked the story
                );
            }
        } else {
            // If the user is already liking the story, remove the like
            likableStory.likes--;
            await this.likeStoryRepository.remove(existingLike);
        }
    
        // Save the updated story
        await this.storyRepository.save(likableStory);
    
        return { isLiked };
    }
    

}
