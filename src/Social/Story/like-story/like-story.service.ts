import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Story} from '../stories/entity/stories.entity';
import {likeStory} from './entity/like-story.entity';
import {User} from '@/User/user/entity/user.entity';

@Injectable()
export class LikeStoryService {
    constructor(
        @InjectRepository(Story)
        private readonly storyRepository: Repository<Story>,
        @InjectRepository(likeStory)
        private readonly likeStoryRepository: Repository<likeStory>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
    }

    async likeStory(
        storyId: number,
        user: User,
    ): Promise<{ isLiked: boolean }> {

        const likableStory = await this.storyRepository.findOneBy(
            {id: storyId}
        );

        if (!likableStory) {
            throw new NotFoundException('Story not found!');
        }


        if (!user) {
            throw new NotFoundException('User not found');
        }

        let existingLike = await this.likeStoryRepository.findOne({
            where: {story: {id: storyId}, user: {id: user.id}},
        });

        if (!existingLike) {
            existingLike = this.likeStoryRepository.create({
                story: likableStory,
                user,
            });
            likableStory.likes++;
            await this.likeStoryRepository.save(existingLike);
        } else {
            likableStory.likes--;
            await this.likeStoryRepository.remove(existingLike);
        }

        await this.storyRepository.save(likableStory);

        return {isLiked: !existingLike,};
    }

}
