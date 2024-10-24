import {Injectable, NotFoundException} from '@nestjs/common';
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
import { savePost } from '@/Social/Post/save-post/entity/save-post.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(FollowUser)
        private followUserRepository: Repository<FollowUser>,
        @InjectRepository(likePost)
        private likePostRepository: Repository<likePost>,
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
        // Fetch followed users' stories
        const stories = await this.storyRepository
            .createQueryBuilder('stories')
            .leftJoinAndSelect('stories.user', 'user')
            .leftJoin('follow', 'f', 'f.followingId = stories.userId')
            .select([
                'stories.id AS story_id',
                'stories.thumbnail AS story_thumbnail',
                'user.id AS user_id',
                'user.name AS user_name',
                'user.profilePic AS user_profilePic',
                'user.username AS user_username',
                'stories.mediaUrl AS story_media',
            ])
            .where('(stories.expiresAt IS NULL OR stories.expiresAt > :now)', { now: new Date() })
            .andWhere('f.followerId = :userId', { userId: user.id }) // Only stories from followed users
            .orderBy('stories.createdAt', 'DESC')
            .limit(10)
            .getRawMany();
    
        // Fetch followed users' posts
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
                'user.profilePic AS user_profilePic',
                'user.username AS user_username',
                'COUNT(comments.id) AS comments_count',
                'COUNT(postLikes.id) AS like_count',
                'post.createdAt AS createdAt',
                'post.media AS post_media',
                'post.content AS post_content',
            ])
            .where('f.followerId = :userId', { userId: user.id }) // Only posts from followed users
            .groupBy('post.id, user.id')
            .orderBy('post.createdAt', 'DESC')
            .limit(10)
            .getRawMany();
    
        const club = await this.clubRepository
            .createQueryBuilder('club')
            .select([
                'club.id AS club_id',
                'club.name AS club_name',
                'club.memberCount AS club_memberCount',
                'club.cover AS club_cover',
                'club.link AS club_link',
            ])
            .where('club.id = :id', { id: 1 })
            .getRawOne();
    
        const finalPosts = [];
        for (const post of posts) {
            let existingLike = await this.likePostRepository.findOne({
                where: { post: { id: post.post_id }, user: { id: user.id } },
            });
            let existingSave = await this.savePostRepository.findOne({
                where: { post: { id: post.post_id }, user: { id: user.id } },
            });
            finalPosts.push({
                content: post.post_content,
                media: post.media,
                id: post.post_id,
                user: {
                    id: post.user_id,
                    name: post.user_name,
                    pic: post.user_profilePic,
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
                club: club
                    ? {
                          id: club.club_id,
                          name: club.club_name,
                          image: club.club_cover,
                          memberCount: club.club_memberCount,
                      }
                    : null,
            });
        }
    
        return {
            posts: finalPosts,
            stories: stories.map((story) => ({
                id: story.story_id,
                user: {
                    id: story.user_id,
                    name: story.user_name,
                    pic: story.user_profilePic,
                    username: story.user_username,
                },
                thumb: story.story_thumbnail,
                media: story.mediaUrl, // Ensure this is an array of URLs
            })),
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
                'user.profilePic AS user_profilePic',
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
                content: post.post_content, // Structure for additional images if needed
                media: post.media,
                id: post.post_id,
                user: {
                    id: post.user_id,
                    name: post.user_name,
                    pic: post.user_profilePic,
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
        const user = await this.userRepository.findOne({
            where: {id: userId},
            relations: [
                'posts',
                'stories',
                'comments',
                'sentMessages',
                'receivedMessages',
                'sentNotifications',
                'receivedNotifications',
                'collectionEntities',
                'createdNfts',
                'ownedNfts',
                'auctions',
                'bids',
                'supportTickets',
                'forumTopics',
                'forumPosts',
                'storyLikes',
                'postLikes',
                'commentLikes',
                'club',
            ],
        });

        if (!user) {
            throw new Error('User not found');
        }
        if (!self) {
            throw new Error('Self User not found');
        }

        // Correct the 'where' condition for follow counts
        const followersCount = await this.userRepository.count({
            where: {following: {id: userId}}, // Referencing the 'User' object here
        });

        const followingCount = await this.userRepository.count({
            where: {followers: {id: userId}}, // Referencing the 'User' object here
        });

        const posts = user.posts.map(post => ({
            id: post.id,
            thumb: post.mediaUrl,
        }));

        const stories = user.stories.map(story => ({
            id: story.id,
            thumb: story.thumbnail,
            createdAt: story.createdAt,
            user: {
                id: user.id,
                name: user.name ?? user.username,
                username: user.username,
                pic: user.profilePic ?? "",
            },
        }));

        const notifications = user.sentNotifications;

        const supportTickets = user.supportTickets;

        let isFollowing = await this.followUserRepository.findOneBy({
            followerId: self.id,
            followingId: userId
        });
        return {
            id: user.id,
            username: user.username,
            profilePic: user.profilePic,
            followers: followersCount,
            following: followingCount,
            isFollowing: !!isFollowing,
            bio: user.bio,
            stories,

            settings: notifications ? notifications : null,
        };
    }

    async getAllUsers() {
        const users = await this.userRepository.find({
            select: ['username', 'name', 'id', 'profilePic', 'createdAt'], // Adjust fields as necessary
        });

        return {
            statusCode: 200,
            result: users,
        };
    }

    async follow(
        userId: number,
        user: User,
    ): Promise<{ isFollowing: boolean }> {


        if (!user) {
            throw new NotFoundException('User not found');
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
        } else {
            await this.followUserRepository.remove(isFollowing);
        }

        return {isFollowing: !isFollowing};
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
}
