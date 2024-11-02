import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import {LessThan, MoreThan, Repository} from 'typeorm';
import { Story } from '@/social/story/stories/entity/stories.entity';
import { CreateStoryDto } from '@/social/story/stories/entity/dto/createStory.dto';
import { ApiResponses, createResponse } from '@/utils/response.util';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/user/user/entity/user.entity';
import { UpdateStoryDto } from '@/social/story/stories/entity/dto/updateStory.dto';
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
        user: User,
        createStoryDto: CreateStoryDto
    ): Promise<ApiResponses<any>> {

        const { mediaUrl, expiresAt } = createStoryDto;
    

    
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const recentStory = await this.storyRepository.findOne({
            where: {
                user: {id: user.id},
                createdAt: MoreThan(new Date(Date.now() - 24 * 60 * 60 * 1000)) // آخرین ۲۴ ساعت
            },
        });
        console.log(recentStory)

        if (recentStory) {
            // اگر استوری اخیر وجود داشت، mediaUrl جدید را اضافه کرده و استوری جدیدی ثبت نمی‌کنیم
            recentStory.mediaUrl = [...recentStory.mediaUrl, ...mediaUrl];
            const updatedStory = await this.storyRepository.save(recentStory);

            const response = {
                id: updatedStory.id,
                mediaUrl: updatedStory.mediaUrl,
                thumbnail: updatedStory.thumbnail,
                expiresAt: updatedStory.expiresAt,
                createdAt: updatedStory.createdAt,
                updatedAt: updatedStory.updatedAt,
                likes: updatedStory.likes,
                dislikes: updatedStory.dislikes,
                user: {
                    username: user.username
                }
            };

            return createResponse(200, response);
        }

        const story = {
            mediaUrl: mediaUrl,
            thumbnail: mediaUrl[0],
            expiresAt,
            user,
            userId:user.id,
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
            throw new UnauthorizedException('User not found');
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
            throw new UnauthorizedException('User not found');
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
