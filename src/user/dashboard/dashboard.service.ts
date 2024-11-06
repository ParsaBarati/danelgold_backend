
import { Between, MoreThan, Repository } from "typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Admin } from "../admin/entity/admin.entity";
import { User } from "../user/entity/user.entity";
import { Post } from "@/social/post/posts/entity/posts.entity";
import { Story } from "@/social/story/stories/entity/stories.entity";
import { Message } from "@/social/message/message/entity/message.entity";
import { Notification, NotificationAction } from "@/social/notification/entity/notification.entity";
import { SendNotificationDto } from "@/user/dashboard/dto/notification.dto";
import { NotificationService } from "@/social/notification/notification.service";

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(Admin)
        private readonly adminRepository: Repository<Admin>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(Story)
        private readonly storyRepository: Repository<Story>,
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
        @InjectRepository(Notification)
        private readonly notificationRepository: Repository<Notification>,
        private readonly notificationService: NotificationService,
    ) {}

    async getUserInsights(): Promise<any> {
        const totalUsers = await this.userRepository.count();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const newUsers = await this.userRepository.count({ where: { createdAt: MoreThan(yesterday) } });
        const activeUsers = await this.userRepository.count({ where: { lastLogin: MoreThan(yesterday) } });

        const pastWeekData = await this.generateWeeklyData(this.userRepository, 'createdAt');

        return { totalUsers, newUsers, activeUsers, userGrowth: pastWeekData };
    }

    async getPostInsights(): Promise<any> {
        const totalPosts = await this.postRepository.count();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const newPosts = await this.postRepository.count({ where: { createdAt: MoreThan(yesterday) } });
        const sharedPosts = await this.postRepository.count({ where: { shares: MoreThan(0) } });

        const pastWeekPostData = await this.generateWeeklyData(this.postRepository, 'createdAt');

        return { totalPosts, newPosts, sharedPosts, postGrowth: pastWeekPostData };
    }

    async getStoryInsights(): Promise<any> {
        const totalStories = await this.storyRepository.count();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const newStories = await this.storyRepository.count({ where: { createdAt: MoreThan(yesterday) } });

        const pastWeekStoryData = await this.generateWeeklyData(this.storyRepository, 'createdAt');

        return { totalStories, newStories, storyGrowth: pastWeekStoryData };
    }

    async getAllUsers(page: number, limit: number, sortType: string = 'asc') {
        const [users, total] = await this.userRepository.findAndCount({
            select: ['id', 'username', 'name', 'profilePic', 'bio', 'email', 'phone', 'isVerified', 'createdAt', 'updatedAt'],
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: sortType.toUpperCase() === 'ASC' ? 'ASC' : 'DESC' },
        });

        // Further processing with counts and mapping (followers, following, etc.) would follow here

        return { result: users, total, page, limit };
    }

    async getAllPosts(page: number, limit: number, sortType: string = 'asc') {
        const [posts, total] = await this.postRepository.findAndCount({
            select: ['id', 'caption', 'content', 'mediaUrl', 'likes', 'dislikes', 'saves', 'shares', 'createdAt'],
            relations: ['user'],
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: sortType.toUpperCase() === 'ASC' ? 'ASC' : 'DESC' },
        });

        return { result: posts, total, page, limit };
    }

    async deletePost(id: string): Promise<void> {
        const deleteResult = await this.postRepository.delete(id);
        if (!deleteResult.affected) {
            throw new NotFoundException('Post not found');
        }
    }

    async getAllStories(page: number, limit: number, sortType: string = 'asc') {
        const [stories, total] = await this.storyRepository.findAndCount({
            select: ['id', 'thumbnail', 'mediaUrl', 'likes', 'dislikes', 'createdAt', 'expiresAt'],
            relations: ['user'],
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: sortType.toUpperCase() === 'ASC' ? 'ASC' : 'DESC' },
        });

        return { result: stories, total, page, limit };
    }

    async deleteStory(id: string): Promise<void> {
        const deleteResult = await this.storyRepository.delete(id);
        if (!deleteResult.affected) {
            throw new NotFoundException('Story not found');
        }
    }

    async getAllNotifications(page: number, limit: number, sortType: string = 'asc') {
        const [notifications, total] = await this.notificationRepository.findAndCount({
            select: ['id', 'title', 'thumb', 'action', 'createdAt'],
            relations: ['user', 'recipient'],
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: sortType.toUpperCase() === 'ASC' ? 'ASC' : 'DESC' },
        });

        return { result: notifications, total, page, limit };
    }

    async getUserById(userId: string) {
        const user = await this.userRepository.findOne({
            where: { id: Number.parseInt(userId) },
            select: ['id', 'username', 'name', 'profilePic', 'bio', 'email', 'phone', 'isVerified', 'createdAt', 'updatedAt'],
        });

        if (!user) throw new NotFoundException('User not found');

        return user;
    }

    async sendNotification(sendNotificationDto: SendNotificationDto): Promise<Notification> {
        const { userId, title } = sendNotificationDto;
        const recipient = await this.userRepository.findOne({ where: { id: userId } });
        if (!recipient) throw new NotFoundException('Recipient not found');

        return this.notificationService.sendNotification(userId, NotificationAction.NOTIF, title, null);
    }

    private async generateWeeklyData(repository, dateField: string) {
        const today = new Date();
        const data: { date: string; count: number }[] = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const startOfDay = new Date(date.setHours(0, 0, 0, 0));
            const endOfDay = new Date(date.setHours(23, 59, 59, 999));

            const count = await repository.count({
                where: { [dateField]: Between(startOfDay, endOfDay) },
            });

            data.push({ date: new Date(startOfDay).toISOString().slice(0, 10), count });
        }

        return data;
    }
}
