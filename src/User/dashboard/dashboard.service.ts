import {Between, MoreThan, Repository} from "typeorm";
import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Admin} from "../admin/entity/admin.entity";
import {User} from "../user/entity/user.entity";
import {Post} from "@/Social/Post/posts/entity/posts.entity";
import {Story} from "@/Social/Story/stories/entity/stories.entity";
import {Message} from "@/Social/Message/message/entity/message.entity";
import {Notification} from "@/Social/Notification/entity/notification.entity";

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
    ) {
    }

    // Fetch all insights in a single method
    async getUserInsights(): Promise<any> {
        const totalUsers = await this.userRepository.count();

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const newUsers = await this.userRepository.count({
            where: {
                createdAt: MoreThan(yesterday),
            },
        });

        const activeUsers = await this.userRepository.count({
            where: {
                lastLogin: MoreThan(yesterday),
            },
        });

        const today = new Date();
        const pastWeekData: { date: string; count: number }[] = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);

            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            const count = await this.userRepository.count({
                where: {
                    createdAt: Between(startOfDay, endOfDay),
                },
            });

            pastWeekData.push({
                date: startOfDay.toISOString().slice(0, 10), // Format as YYYY-MM-DD
                count,
            });
        }

        return {
            totalUsers,
            newUsers,
            activeUsers,
            userGrowth: pastWeekData,
        };
    }

    // New method for post insights
    async getPostInsights(): Promise<any> {
        // Get total posts
        const totalPosts = await this.postRepository.count();

        // Calculate date for 24 hours ago
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        // Get new posts in the last 24 hours
        const newPosts = await this.postRepository.count({
            where: {
                createdAt: MoreThan(yesterday),
            },
        });
        // Calculate shared posts count (posts with at least one share)
        const sharedPosts = await this.postRepository.count({
            where: {
                shares: MoreThan(0), // Only count posts that have been shared at least once
            },
        });
        // Get post growth over the last 7 days
        const today = new Date();
        const pastWeekPostData: { date: string; count: number }[] = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);

            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            const count = await this.postRepository.count({
                where: {
                    createdAt: Between(startOfDay, endOfDay),
                },
            });

            pastWeekPostData.push({
                date: startOfDay.toISOString().slice(0, 10), // Format as YYYY-MM-DD
                count,
            });
        }

        // Return the post insights data
        return {
            totalPosts,
            newPosts,
            sharedPosts,
            postGrowth: pastWeekPostData,
        };
    }

    // New method for story insights
    async getStoryInsights(): Promise<any> {
        // Get total stories
        const totalStories = await this.storyRepository.count();

        // Calculate date for 24 hours ago
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        // Get new stories in the last 24 hours
        const newStories = await this.storyRepository.count({
            where: {
                createdAt: MoreThan(yesterday),
            },
        });

        // Get story growth over the last 7 days
        const today = new Date();
        const pastWeekStoryData: { date: string; count: number }[] = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);

            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            const count = await this.storyRepository.count({
                where: {
                    createdAt: Between(startOfDay, endOfDay),
                },
            });

            pastWeekStoryData.push({
                date: startOfDay.toISOString().slice(0, 10), // Format as YYYY-MM-DD
                count,
            });
        }

        // Return the story insights data
        return {
            totalStories,
            newStories,
            storyGrowth: pastWeekStoryData,
        };
    }

    async getAllUsers(page: number, limit: number) {
        console.log(page, limit)
        console.log(Number.parseInt(((page - 1) * limit).toString()))
        const [users, total] = await this.userRepository.findAndCount({
            select: [
                'id',
                'username',
                'name',
                'profilePic',
                'bio',
                'email',
                'phone',
                'isVerified',
                'createdAt',
                'updatedAt',
            ],
            skip: Number.parseInt(((page - 1) * limit).toString()),
            take: limit,
        });

        // Fetch counts for each user in separate queries
        const userIds = users.map(user => user.id);

        if (userIds.length === 0) {
            return {
                result: [],
                total,
                page,
                limit,
            };
        }
        // Followers Count
        const followersCounts = await this.userRepository
            .createQueryBuilder('user')
            .select('user.id, COUNT(follow.id) as followersCount')
            .leftJoin('user.followers', 'follow')
            .where('user.id IN (:...userIds)', {userIds})
            .groupBy('user.id')
            .getRawMany();

        const followersMap = Object.fromEntries(
            followersCounts.map(item => [item.id, Number(item.followersCount)])
        );

        // Following Count
        const followingCounts = await this.userRepository
            .createQueryBuilder('user')
            .select('user.id, COUNT(follow.id) as followingCount')
            .leftJoin('user.following', 'follow')
            .where('user.id IN (:...userIds)', {userIds})
            .groupBy('user.id')
            .getRawMany();

        // Block Count
        const blockCounts = await this.userRepository
            .createQueryBuilder('user')
            .select('user.id, COUNT(block.id) as blockCount')
            .leftJoin('user.blockedUsers', 'block') // Assuming you have a 'blocks' relation in your User entity
            .where('user.id IN (:...userIds)', {userIds})
            .groupBy('user.id')
            .getRawMany();

        const followingMap = Object.fromEntries(
            followingCounts.map(item => [item.id, Number(item.followingCount)])
        );

        const blockMap = Object.fromEntries(
            blockCounts.map(item => [item.id, Number(item.blockCount)])
        );

        // Post Count
        const postCounts = await this.userRepository
            .createQueryBuilder('user')
            .select('user.id, COUNT(post.id) as postCount')
            .leftJoin('user.posts', 'post')
            .where('user.id IN (:...userIds)', {userIds})
            .groupBy('user.id')
            .getRawMany();

        const postMap = Object.fromEntries(
            postCounts.map(item => [item.id, Number(item.postCount)])
        );

        // Comment Count
        const commentCounts = await this.userRepository
            .createQueryBuilder('user')
            .select('user.id, COUNT(comment.id) as commentCount')
            .leftJoin('user.comments', 'comment')
            .where('user.id IN (:...userIds)', {userIds})
            .groupBy('user.id')
            .getRawMany();

        const commentMap = Object.fromEntries(
            commentCounts.map(item => [item.id, Number(item.commentCount)])
        );

        // Like Count (for posts)
        const likeCounts = await this.userRepository
            .createQueryBuilder('user')
            .select('user.id, COUNT(likePost.id) as likeCount')
            .leftJoin('user.postLikes', 'likePost')
            .where('user.id IN (:...userIds)', {userIds})
            .andWhere('likePost.isLike = :isLike', {isLike: 1}) // Only count likes
            .groupBy('user.id')
            .getRawMany();

        const likeMap = Object.fromEntries(
            likeCounts.map(item => [item.id, Number(item.likeCount)])
        );

        // Dislike Count
        const dislikeCounts = await this.userRepository
            .createQueryBuilder('user')
            .select('user.id, COUNT(dislikePost.id) as dislikeCount')
            .leftJoin('user.postLikes', 'dislikePost')
            .where('user.id IN (:...userIds)', {userIds})
            .andWhere('dislikePost.isLike = :isLike', {isLike: -1}) // Only count dislikes
            .groupBy('user.id')
            .getRawMany();


        const dislikeMap = Object.fromEntries(
            dislikeCounts.map(item => [item.id, Number(item.dislikeCount)])
        );

        // Save Posts Count
        const savePostCounts = await this.userRepository
            .createQueryBuilder('user')
            .select('user.id, COUNT(savePost.id) as savePostsCount')
            .leftJoin('user.postSaves', 'savePost')
            .where('user.id IN (:...userIds)', {userIds})
            .groupBy('user.id')
            .getRawMany();

        const savePostMap = Object.fromEntries(
            savePostCounts.map(item => [item.id, Number(item.savePostsCount)])
        );

        // Story Count
        const storyCounts = await this.userRepository
            .createQueryBuilder('user')
            .select('user.id, COUNT(story.id) as storyCount')
            .leftJoin('user.stories', 'story')
            .where('user.id IN (:...userIds)', {userIds})
            .groupBy('user.id')
            .getRawMany();

        const storyMap = Object.fromEntries(
            storyCounts.map(item => [item.id, Number(item.storyCount)])
        );

        // Notification Count
        const notificationCounts = await this.userRepository
            .createQueryBuilder('user')
            .select('user.id, COUNT(notification.id) as notificationCount')
            .leftJoin('user.receivedNotifications', 'notification')
            .where('user.id IN (:...userIds)', {userIds})
            .groupBy('user.id')
            .getRawMany();

        const notificationMap = Object.fromEntries(
            notificationCounts.map(item => [item.id, Number(item.notificationCount)])
        );

        // Messages Count
        const messageCounts = await this.userRepository
            .createQueryBuilder('user')
            .select('user.id, COUNT(message.id) as messagesCount')
            .leftJoin('user.receivedMessages', 'message')
            .where('user.id IN (:...userIds)', {userIds})
            .groupBy('user.id')
            .getRawMany();

        const messageMap = Object.fromEntries(
            messageCounts.map(item => [item.id, Number(item.messagesCount)])
        );

        // Combine all counts into the user data
        const userWithCounts = users.map(user => ({
            ...user,
            followersCount: followersMap[user.id] || 0,
            followingCount: followingMap[user.id] || 0,
            blockCount: blockMap[user.id] || 0,
            postCount: postMap[user.id] || 0,
            commentCount: commentMap[user.id] || 0,
            likeCount: likeMap[user.id] || 0,
            dislikeCount: dislikeMap[user.id] || 0,
            savePostsCount: savePostMap[user.id] || 0,
            storyCount: storyMap[user.id] || 0,
            notificationCount: notificationMap[user.id] || 0,
            messagesCount: messageMap[user.id] || 0,
        }));

        return {
            result: userWithCounts,
            total,
            page,
            limit,
        };
    }

    async getAllPosts(page: number, limit: number) {
        console.log(page, limit);
        console.log(Number.parseInt(((page - 1) * limit).toString()));

        const [posts, total] = await this.postRepository.findAndCount({
            select: [
                'id',
                'caption',
                'content',
                'mediaUrl',
                'likes',
                'dislikes',
                'saves',
                'shares',
                'createdAt',
            ],
            relations: ['user'],  // Join the User entity to get user details

            skip: Number.parseInt(((page - 1) * limit).toString()),
            take: limit,
        });

        if (posts.length === 0) {
            return {
                result: [],
                total,
                page,
                limit,
            };
        }

        // Counts for Comments
        const commentsCounts = await this.postRepository
            .createQueryBuilder('post')
            .select('post.id, COUNT(comment.id) as commentsCount')
            .leftJoin('post.comments', 'comment')
            .where('post.id IN (:...postIds)', {postIds: posts.map(post => post.id)})
            .groupBy('post.id')
            .getRawMany();

        const commentMap = Object.fromEntries(
            commentsCounts.map(item => [item.id, Number(item.commentsCount)])
        );

        // Combine counts and details into post data
        const postsWithCounts = posts.map(post => ({
            id: post.id,
            caption: post.caption,
            content: post.content,
            mediaUrl: post.mediaUrl,
            likesCount: post.likes,
            dislikesCount: post.dislikes,
            savesCount: post.saves,
            sharesCount: post.shares,
            commentsCount: commentMap[post.id] || 0,
            createdAt: post.createdAt,
            user: {
                id: post.user.id,
                name: post.user.name,
                username: post.user.username,
                profilePicture: post.user.profilePic,
                email: post.user.email,
                phone: post.user.phone,
            }
        }));

        return {
            result: postsWithCounts,
            total,
            page,
            limit,
        };
    }

    async deletePost(id: string): Promise<void> {
        const deleteResult = await this.postRepository.delete(id);

        if (!deleteResult.affected) {
            throw new NotFoundException('Post not found');
        }
    }

    async getAllStories(page: number, limit: number) {
        const [stories, total] = await this.storyRepository.findAndCount({
            select: [
                'id',
                'thumbnail',
                'mediaUrl',
                'likes',
                'dislikes',
                'createdAt',
                'expiresAt',
            ],
            relations: ['user'], // Join the User entity to get user details

            skip: Number.parseInt(((page - 1) * limit).toString()),
            take: limit,
        });

        if (stories.length === 0) {
            return {
                result: [],
                total,
                page,
                limit,
            };
        }

        // Combine counts and details into story data
        const storiesWithCounts = await Promise.all(
            stories.map(async (story) => {
                let replyCount = await this.getReplyCountByStoryId(story.id);
                return {
                    id: story.id,
                    thumbnail: story.thumbnail,
                    mediaUrl: story.mediaUrl,
                    likes: story.likes,
                    replies: replyCount,
                    dislikes: story.dislikes,
                    createdAt: story.createdAt,
                    expiresAt: story.expiresAt,

                    user: {
                        id: story.user.id,
                        name: story.user.name,
                        username: story.user.username,
                        profilePicture: story.user.profilePic,
                    },
                };
            })
        );

        return {
            result: storiesWithCounts,
            total,
            page,
            limit,
        };
    }

    async deleteStory(id: string): Promise<void> {
        const deleteResult = await this.storyRepository.delete(id);

        if (!deleteResult.affected) {
            throw new NotFoundException('Story not found');
        }
    }

    async getReplyCountByStoryId(storyReplyId: number): Promise<number> {
        return await this.messageRepository.count({
            where: {storyReplyId},
        });
    }


    async getAllNotifications(page: number, limit: number) {
        const [notifications, total] = await this.notificationRepository.findAndCount({
            select: [
                'id',
                'title',
                'thumb',
                'action',
                'createdAt',
            ],
            relations: ['user', 'recipient'], // Join the User entity to get user details

            skip: Number.parseInt(((page - 1) * limit).toString()),
            take: limit,
        });

        if (notifications.length === 0) {
            return {
                result: [],
                total,
                page,
                limit,
            };
        }

        // Combine details into notification data
        const notificationsWithDetails = notifications.map((notification) => ({
            id: notification.id,
            title: notification.title,
            thumb: notification.thumb,
            action: notification.action,
            createdAt: notification.createdAt,

            user: {
                id: notification.user?.id,
                name: notification.user?.name,
                username: notification.user?.username,
                profilePicture: notification.user?.profilePic,
            },
            recipient: {
                id: notification.recipient.id,
                name: notification.recipient.name,
                username: notification.recipient.username,
                profilePicture: notification.recipient.profilePic,
            }
        }));

        return {
            result: notificationsWithDetails,
            total,
            page,
            limit,
        };
    }

}
