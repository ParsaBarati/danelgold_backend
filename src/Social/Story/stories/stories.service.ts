import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LessThan, Repository } from 'typeorm';
import { Story } from './entity/stories.entity';
import { CreateStoryDto } from './entity/dto/createStory.dto';
import { ApiResponses, createResponse } from '@/utils/response.util';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/User/user/entity/user.entity';
import { UpdateStoryDto } from './entity/dto/updateStory.dto';
import { CronJob } from 'cron';

@Injectable()
export class StoriesService {
    private job: CronJob;
    constructor(
        @InjectRepository(Story)
        private readonly storyRepository: Repository<Story>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

    ){}

    async createStory(
        userIdentifier: string,
        createStoryDto: CreateStoryDto
    ): Promise<ApiResponses<any>> {

        const { mediaUrl, expiresAt } = createStoryDto;
    
        const user = await this.userRepository.findOne({
            where: [
                { phone: userIdentifier }, 
                { email: userIdentifier }
            ],
        });
    
        if (!user) {
            throw new NotFoundException('کاربر یافت نشد');
        }
    
        const story = {
            mediaUrl,
            thumbnail: mediaUrl[0],
            expiresAt,
            user,
            userIdentifier:userIdentifier,
            createdAt: new Date(),
        };
    
        const savedStory = await this.storyRepository.save(story);
    
        const response = {
            id: savedStory.id,
            mediaUrl: savedStory.mediaUrl,
            thumbnail: savedStory.thumbnail,
            expiresAt: savedStory.expiresAt,
            createdAt: savedStory.createdAt,
            updatedAt: savedStory.updatedAt,
            likes: savedStory.likes,
            dislikes: savedStory.dislikes,
            user: {
                username: user.username
            }
        };
    
        return createResponse(201, response);
    }
    
    async updateStory(
        storyId: number,
        currentUserIdentifier: string, 
        updateStoryDto: UpdateStoryDto
    ):Promise<ApiResponses<Story>>{

        const story = await this.storyRepository.findOneBy({ id: storyId });

        if(!story){
            throw new NotFoundException('استوری یافت نشد')
        }

        const user = await this.userRepository.findOne({
            where: [{ phone: currentUserIdentifier }, { email: currentUserIdentifier }]
        });
    
        if (!user) {
            throw new UnauthorizedException('کاربر یافت نشد');
        }

        if(story.user.id !== user.id){
            throw new UnauthorizedException('شما مجاز به ویرایش نیستید')
        }

        story.mediaUrl = updateStoryDto.mediaUrl;
        story.expiresAt = updateStoryDto.expiresAt;

        story.updatedAt = new Date();

        const updatedStory = await this.storyRepository.save(story);

        return createResponse(200,updatedStory)
    }

    async removeStory(
        storyId: number,
        currentUserIdentifier: string,
    ):Promise<{message: string}>{

        const story = await this.storyRepository.findOneBy({ id: storyId})

        if(!story){
            throw new NotFoundException('استوری یافت نشد')
        }

        const user = await this.userRepository.findOne({
            where: [{ phone: currentUserIdentifier }, { email: currentUserIdentifier }]
        });
    
        if (!user) {
            throw new UnauthorizedException('کاربر یافت نشد');
        }

        if(story.user.id !== user.id ){
            throw new UnauthorizedException('شما مجاز به حذف نیستید')
        }

        if(story.expiresAt === null){
            throw new BadRequestException('استوری دائمی قابل خذف نیست')
        }

        await this.storyRepository.remove(story);

        return{ message: 'استوری با موفقیت حذف شد' }
    }

    async checkExpiredStory(): Promise<any> {
        const currentDate = new Date();
    
        const expiredStories = await this.storyRepository.find({
          where: { expiresAt: LessThan(currentDate) },
        });
    
        if (expiredStories.length > 0) {

          await this.storyRepository.remove(expiredStories);        
        }
    }

    onModuleInit() {
        this.job = new CronJob('* * * * *', async () => {
          await this.checkExpiredStory();
          console.log('Cron job for expired stories ran.');
        });
        this.job.start();
      }
      
      onModuleDestroy() {
        if (this.job) {
          this.job.stop();
        }
      }
}
