import {ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm/index';
import {User} from '@/User/user/entity/user.entity';
import {UserInformation} from '@/User/user/interface/userInformation.interface';
import {Token} from '@/User/auth/token/entity/token.entity';
import {SmsService} from '@/services/sms.service';
import {Post} from '@/Social/Post/posts/entity/posts.entity';
import {Story} from '@/Social/Story/stories/entity/stories.entity';
import {Club} from '@/Social/Club/entity/club.entity';
import {likePost} from "@/Social/Post/like-post/entity/like-post.entity";
import {FollowUser} from "@/Social/Follow/entity/follow.entity";
import {savePost} from '@/Social/Post/save-post/entity/save-post.entity';
import {likeStory} from "@/Social/Story/like-story/entity/like-story.entity";
import {NotificationService} from "@/Social/Notification/notification.service";
import {NotificationAction} from "@/Social/Notification/entity/notification.entity";
import {BlockUser} from '@/Social/Block/entity/block.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(FollowUser)
        private followUserRepository: Repository<FollowUser>,
        @InjectRepository(BlockUser)
        private blockUserRepository: Repository<BlockUser>,
        @InjectRepository(likePost)
        private likePostRepository: Repository<likePost>,
        @InjectRepository(likeStory)
        private likeStoryRepository: Repository<likeStory>,
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(savePost)
        private readonly savePostRepository: Repository<savePost>,
        @InjectRepository(Story)
        private readonly storyRepository: Repository<Story>,
        @InjectRepository(Club)
        private readonly clubRepository: Repository<Club>,
        @InjectRepository(Token)
        private readonly tokenRepository: Repository<Token>,
        private readonly smsService: SmsService,
        private readonly notificationService: NotificationService
    ) {
    }

    async getUser(user: any): Promise<UserInformation> {

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return {
            id: user.id ?? user.sub,
            phone: user.phone,
            email: user.email,
            name: user.name,
            username: user.username,
            profilePic: user.profilePic,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }

    async getHomepageData(user: User): Promise<any> {

        const userStory = await this.storyRepository
            .createQueryBuilder('stories')
            .leftJoinAndSelect('stories.user', 'user')
            .select([
                'stories.id AS story_id',
                'stories.thumbnail AS story_thumbnail',
                'user.id AS user_id',
                'user.name AS user_name',
                'user.username AS user_username',
                'user.profilePic AS user_profilepic',
                'stories.mediaUrl AS story_media',
                'stories.createdAt AS story_createdAt',
            ])
            .where('stories.userId = :userId', {userId: user.id})
            .andWhere('(stories.expiresAt IS NULL OR stories.expiresAt > :now)', {now: new Date()})
            .andWhere('stories.createdAt > :last24hours', {last24hours: new Date(Date.now() - 24 * 60 * 60 * 1000)}) // Only stories from the last 24 hours
            .getRawOne(); // Fetch the user's own story, if exists

        // Fetch followed users' stories within the last 24 hours
        const stories = await this.storyRepository
            .createQueryBuilder('stories')
            .leftJoinAndSelect('stories.user', 'user')
            .leftJoin('follow', 'f', 'f.followingId = stories.userId')
            .select([
                'stories.id AS story_id',
                'stories.thumbnail AS story_thumbnail',
                'user.id AS user_id',
                'user.name AS user_name',
                'user.username AS user_username',
                'user.profilePic AS user_profilepic',
                'stories.mediaUrl AS story_media',
                'stories.createdAt AS story_createdAt',

            ])
            .where('(stories.expiresAt IS NULL OR stories.expiresAt > :now)', {now: new Date()})
            .andWhere('f.followerId = :userId', {userId: user.id}) // Only stories from followed users
            .andWhere('stories.createdAt > :last24hours', {last24hours: new Date(Date.now() - 24 * 60 * 60 * 1000)}) // Only stories from the last 24 hours
            .orderBy('stories.createdAt', 'DESC')
            .getRawMany();

        // Prepare final stories array
        const finalStories = [];

        // Add the user's own story first, if it exists
        if (userStory) {
            let existingLike = await this.likeStoryRepository.findOne({
                where: {story: {id: userStory.story_id}, user: {id: user.id}},
            });
            finalStories.push({
                id: userStory.story_id,
                user: {
                    id: userStory.user_id,
                    name: userStory.user_name,
                    pic: userStory.user_profilepic,
                    username: userStory.user_username,
                },
                thumb: userStory.story_thumbnail,
                media: userStory.story_media, // Ensure this is an array of URLs
                isLiked: !!existingLike,
                createdAt: userStory.createdAt,
            });
        }

        // Add followed users' stories
        for (const story of stories) {
            let existingLike = await this.likeStoryRepository.findOne({
                where: {story: {id: story.story_id}, user: {id: user.id}},
            });

            finalStories.push({
                id: story.story_id,
                user: {
                    id: story.user_id,
                    name: story.user_name,
                    pic: story.user_profilepic,
                    username: story.user_username,
                },
                thumb: story.story_thumbnail,
                media: story.story_media,
                isLiked: !!existingLike,
                createdAt: story.createdAt,

            });
        }

        // Fetch followed users' posts (remains unchanged)
        const posts = await this.postRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.user', 'user')
            .leftJoinAndSelect('post.postLikes', 'postLikes')
            .leftJoinAndSelect('post.comments', 'comments')
            .leftJoin('follow', 'f', 'f.followingId = post.userId')
            .select([
                'post.id AS post_id',
                'post.mediaUrl AS post_mediaUrl',
                'post.caption AS post_caption',
                'post.likes AS post_likes',
                'post.dislikes AS post_dislikes',
                'post.shares AS post_shares',
                'user.id AS user_id',
                'user.name AS user_name',
                'user.profilePic AS user_profilepic',
                'user.username AS user_username',
                'COUNT(comments.id) AS comments_count',
                'COUNT(postLikes.id) AS like_count',
                'post.createdAt AS createdAt',
                'post.media AS post_media',
                'post.content AS post_content',
            ])
            .where('f.followerId = :userId', {userId: user.id}) // Only posts from followed users
            .groupBy('post.id, user.id')
            .orderBy('post.createdAt', 'DESC')
            .limit(10)
            .getRawMany();

        const finalPosts = [];
        for (const post of posts) {
            let existingLike = await this.likePostRepository.findOne({
                where: {post: {id: post.post_id}, user: {id: user.id}},
            });
            let existingSave = await this.savePostRepository.findOne({
                where: {post: {id: post.post_id}, user: {id: user.id}},
            });
            finalPosts.push({
                content: post.post_content,
                media: post.media,
                id: post.post_id,
                user: {
                    id: post.user_id,
                    name: post.user_name,
                    pic: post.user_profilepic,
                    username: post.user_username,
                },
                caption: post.post_caption,
                img: post.post_media,
                likes: post.post_likes,
                dislikes: post.post_dislikes,
                commentsCount: post.comments_count,
                sharesCount: post.post_shares,
                comments: [],
                createdAt: post.createdAt,
                isLiked: !!existingLike && existingLike.isLike == 1,
                isDisliked: !!existingLike && existingLike.isLike == -1,
                isSaved: !!existingSave,
            });
        }

        return {
            posts: finalPosts,
            stories: finalStories,
        };
    }

    async getReels(user: User): Promise<any> {

        const posts = await this.postRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.user', 'user')
            .leftJoinAndSelect('post.postLikes', 'postLikes')
            .leftJoinAndSelect('post.comments', 'comments')
            .select([
                'post.id AS post_id',
                'post.mediaUrl AS post_mediaUrl',
                'post.caption AS post_caption',
                'post.likes AS post_likes',
                'post.dislikes AS post_dislikes',
                'post.shares AS post_shares',
                'user.id AS user_id',
                'user.name AS user_name',
                'user.profilePic AS user_profilepic',
                'user.username AS user_username',
                'COUNT(comments.id) AS comments_count',
                'COUNT(postLikes.id) AS like_count',
                'post.createdAt AS createdAt',
                'post.media AS post_media',
                'post.content AS post_content',
            ])
            .groupBy('post.id, user.id')
            .orderBy('post.createdAt', 'DESC')
            .limit(10)
            .getRawMany();


        const finalPosts = [];
        for (const post of posts) {
            let existingLike = await this.likePostRepository.findOne({
                where: {post: {id: post.post_id}, user: {id: user.id}},
            });
            let existingSave = await this.likePostRepository.findOne({
                where: {post: {id: post.post_id}, user: {id: user.id}},
            });
            finalPosts.push({
                id: post.post_id,
                content: post.post_content, // Structure for additional images if needed
                media: post.media,
                user: {
                    id: post.user_id,
                    name: post.user_name,
                    pic: post.user_profilepic,
                    username: post.user_username,
                },
                caption: post.post_caption,
                img: post.post_media,
                likes: post.post_likes,
                dislikes: post.post_dislikes,
                commentsCount: post.comments_count,
                sharesCount: post.post_shares, // If you have a share count, replace this
                comments: [], // You'll need to fetch and structure comments separately if needed
                createdAt: post.createdAt,
                isLiked: (!!existingLike && existingLike.isLike == 1), // Set based on your logic
                isDisliked: (!!existingLike && existingLike.isLike == -1), // Set based on your logic
                isSaved: (!!existingSave), // Set based on your logic

            });
        }
        return {
            posts: finalPosts,

        };
    }

    async getProfileById(userId: number, self: User) {

        const user = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.posts', 'post')
            .leftJoinAndSelect('user.stories', 'story')
            .where('user.id = :userId', { userId })
            .orderBy('post.createdAt', 'DESC')
            .addOrderBy('story.createdAt', 'DESC')
            .getOne();
        if (!user) {
            throw new Error('User not found');
        }
        if (!self) {
            throw new Error('Self User not found');
        }

        // Correct the 'where' condition for follow counts
        const followersCount = await this.followUserRepository.count({
            where: {followingId: userId}, // Referencing the 'User' object here
        });

        const followingCount = await this.followUserRepository.count({
            where: {followerId: userId}, // Referencing the 'User' object here
        });


        const finalPosts = [];
        for (const post of user.posts) {
            // let existingLike = await this.likePostRepository.findOne({
            //     where: {post: {id: post.id}, user: {id: user.id}},
            // });
            // let existingSave = await this.savePostRepository.findOne({
            //     where: {post: {id: post.id}, user: {id: user.id}},
            // });
            // console.log(post.content)
            finalPosts.push({
                id: post.id,
                thumbnail: post.mediaUrl, // Assuming post has a title
                isStory: false,
                isReel: post.isReel,
                isAvailable: true,
            });
        }

        const stories = user.stories.map(story => ({
            id: story.id,
            thumb: story.thumbnail,
            createdAt: story.createdAt,
            mediaUrl: story.mediaUrl,
            user: {
                id: user.id,
                name: user.name ?? user.username,
                username: user.username,
                pic: user.profilePic ?? "",
            },
        }));

        // const notifications = user.sentNotifications;
        //
        // const supportTickets = user.supportTickets;

        let isFollowing = await this.followUserRepository.findOneBy({
            followerId: self.id,
            followingId: userId
        });
        let isFollowingMe = await this.followUserRepository.findOneBy({
            followingId: self.id,
            followerId: userId
        });
        const isBlocked = await this.blockUserRepository.findOneBy([
            {blockerId: userId, blockedId: self.id},
        ]);

        const iHaveBlocked = await this.blockUserRepository.findOneBy([
            {blockerId: self.id, blockedId: userId},
        ]);

        return {
            id: user.id,
            username: user.username,
            profilePic: !isBlocked ? user.profilePic : "",
            followers: followersCount,
            following: followingCount,
            isFollowing: !!isFollowing,
            isFollowingMe: !!isFollowingMe,
            bio: user.bio,
            stories: !isBlocked ? stories : [],
            posts: (!isBlocked ? finalPosts : []),
            isBlocked: !!isBlocked,
            iHaveBlocked: !!iHaveBlocked,
            // settings: notifications ? notifications : null,
        };

    }

    async getPostsForUser(userId, user: User) {

        const posts = await this.postRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.postLikes', 'postLikes')
            .leftJoinAndSelect('post.comments', 'comments')
            .leftJoinAndSelect('post.user', 'postUser') // Include post creator's information
            .where('post.userId = :userId', {userId})
            .select([
                'post.id AS post_id',
                'post.mediaUrl AS post_mediaUrl',
                'post.caption AS post_caption',
                'post.likes AS post_likes',
                'post.dislikes AS post_dislikes',
                'post.shares AS post_shares',
                'postUser.id AS user_id',
                'postUser.name AS user_name',
                'postUser.profilePic AS user_profilepic',
                'postUser.username AS user_username',
                'COUNT(comments.id) AS comments_count',
                'COUNT(postLikes.id) AS like_count',
                'post.createdAt AS createdAt',
                'post.media AS post_media',
                'post.content AS post_content',
            ])
            .groupBy('post.id, postUser.id') // Group to count likes and comments correctly
            .getRawMany();

        // Map and format the posts data
        const finalPosts = [];

        for (const post of posts) {
            // Check if the user has liked or saved this post
            const [existingLike, existingSave] = await Promise.all([
                this.likePostRepository.findOne({
                    where: {post: {id: post.post_id}, user: {id: user.id}},
                }),
                this.savePostRepository.findOne({
                    where: {post: {id: post.post_id}, user: {id: user.id}},
                })
            ]);

            finalPosts.push({
                content: post.post_content,
                media: post.post_media,
                id: post.post_id,
                user: {
                    id: post.user_id,
                    name: post.user_name,
                    pic: post.user_profilepic,
                    username: post.user_username,
                },
                caption: post.post_caption,
                img: post.post_media,
                likes: post.post_likes,
                dislikes: post.post_dislikes,
                commentsCount: post.comments_count,
                sharesCount: post.post_shares,
                comments: [],
                createdAt: post.createdAt,
                isLiked: !!existingLike && existingLike.isLike === 1,
                isDisliked: !!existingLike && existingLike.isLike === -1,
                isSaved: !!existingSave,
            });
        }

        return finalPosts;
    }

    async follow(
        userId: number,
        user: User,
    ): Promise<{ isFollowing: boolean }> {


        if (!user) {
            throw new NotFoundException('User not found');
        }

        const isBlocked = await this.blockUserRepository.findOneBy([
            {blockerId: user.id, blockedId: userId},
            {blockerId: userId, blockedId: user.id}
        ]);

        if (isBlocked) {
            throw new ForbiddenException('Action not allowed due to a block.');
        }

        let isFollowing = await this.followUserRepository.findOneBy({
            followerId: user.id,
            followingId: userId
        });


        if (!isFollowing) {
            console.log(user.id, userId)
            const follow = await this.followUserRepository.create({
                followerId: user.id,
                followingId: userId
            });
            await this.followUserRepository.save(follow);
            this.notificationService.sendNotification(userId, NotificationAction.FOLLOW, `${user.username} Started following you`, null, user.id,);
        } else {
            await this.followUserRepository.remove(isFollowing);
            this.notificationService.sendNotification(userId, NotificationAction.UNFOLLOW, `${user.username} Stopped following you`, null, user.id,);
        }

        return {isFollowing: !isFollowing};
    }

    async blockUser(
        userId: number,
        user: User,
    ): Promise<{ isBlocked: boolean }> {
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const isBlocked = await this.blockUserRepository.findOneBy({
            blockerId: user.id,
            blockedId: userId
        });

        if (!isBlocked) {
            const block = await this.blockUserRepository.create({
                blockerId: user.id,
                blockedId: userId
            });
            let followRelationships = await this.followUserRepository.findBy([
                { followerId: userId, followingId: user.id },
                { followerId: user.id, followingId: userId }
            ]);
            
            await this.followUserRepository.remove(followRelationships);
            await this.blockUserRepository.save(block);
            return {isBlocked: true};
        } else {
            await this.blockUserRepository.remove(isBlocked);
            return {isBlocked: false};
        }
    }

    async update(user: User, name: string, bio: string) {
        console.log(user)
        if (!user) {
            throw new NotFoundException('User not found');
        }
        if (name) {
            user.name = name;
        }
        console.log(bio)
        if (bio) {
            user.bio = bio;
        }
        await this.userRepository.save(user);
        return user;
    }

    async getFollowers(user: User): Promise<Awaited<{ isFollowing: boolean; name: string; id: number; pic: string; username: string }>[]> {
        const followers = await this.followUserRepository.find({
            where: {followingId: user.id},
            relations: ['follower'],
        });

        // بررسی وضعیت فالو/آنفالو برای هر فالوور
        return await Promise.all(
            followers.map(async (follow) => {
                const isFollowing = await this.followUserRepository.findOne({
                    where: {
                        followerId: user.id,
                        followingId: follow.follower.id,
                    },
                });
                // ایجاد یک کپی از فالوور و اضافه کردن وضعیت فالو/آنفالو
                return {
                    id: follow.follower?.id,
                    name: follow.follower?.name,
                    username: follow.follower?.username,
                    pic: follow.follower?.profilePic ?? "",
                    isFollowing: !!isFollowing,
                };
            })
        );
    }

    async getFollowings(user: User): Promise<{ isFollowing: boolean; name: string; id: number; pic: string; username: string }[]> {
        const followings = await this.followUserRepository.find({
            where: {followerId: user.id},
            relations: ['following'],
        });

        return followings.map(function (follow) {
            return {
                id: follow.following?.id,
                name: follow.following?.name,
                username: follow.following?.username,
                pic: follow.following.profilePic ?? "",
                isFollowing: true,
            };
        });
    }

    async getBlocked(user: User): Promise<{ isBlocked: boolean; name: string; id: number; pic: string; username: string }[]> {
        const blockedUsers = await this.blockUserRepository.find({
            where: {blockerId: user.id},
            relations: ['blocked'],
        });

        return blockedUsers.map((block) => ({
            id: block.blocked?.id,
            name: block.blocked?.name,
            username: block.blocked?.username,
            pic: block.blocked?.profilePic ?? "",
            isBlocked: true,
        }));
    }


}
