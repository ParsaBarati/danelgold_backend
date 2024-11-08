import {ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm/index';
import {User} from '@/user/user/entity/user.entity';
import {UserInformation} from '@/user/user/interface/userInformation.interface';
import {Token} from '@/user/auth/token/entity/token.entity';
import {SmsService} from '@/services/sms.service';
import {Post} from '@/social/post/posts/entity/posts.entity';
import {Story} from '@/social/story/stories/entity/stories.entity';
import {Club} from '@/social/club/entity/club.entity';
import {likePost} from "@/social/post/like-post/entity/like-post.entity";
import {FollowUser} from "@/social/follow/entity/follow.entity";
import {savePost} from '@/social/post/save-post/entity/save-post.entity';
import {likeStory} from "@/social/story/like-story/entity/like-story.entity";
import {NotificationService} from "@/social/notification/notification.service";
import {NotificationAction} from "@/social/notification/entity/notification.entity";
import {BlockUser} from '@/social/block/entity/block.entity';
import {FilterUsersDto} from './dto/filter-user.dto';
import {NFT} from "@/nft/nft/entity/nft.entity";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(FollowUser)
        private followUserRepository: Repository<FollowUser>,
        @InjectRepository(BlockUser)
        private blockUserRepository: Repository<BlockUser>,
        @InjectRepository(NFT)
        private nftRepository: Repository<NFT>,
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

    async getHomepageData(user: User, page: number = 1, limit: number = 10): Promise<any> {
        // Pagination calculation
        const offset = (page - 1) * limit;

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
            .where('stories.userId = :userId', { userId: user.id })
            .andWhere('(stories.expiresAt IS NULL OR stories.expiresAt > :now)', { now: new Date() })
            .andWhere('stories.createdAt > :last24hours', { last24hours: new Date(Date.now() - 24 * 60 * 60 * 1000) })
            .getRawOne();

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
            .where('(stories.expiresAt IS NULL OR stories.expiresAt > :now)', { now: new Date() })
            .andWhere('f.followerId = :userId', { userId: user.id })
            .andWhere('stories.createdAt > :last24hours', { last24hours: new Date(Date.now() - 24 * 60 * 60 * 1000) })
            .orderBy('stories.createdAt', 'DESC')
            .getRawMany();

        const finalStories = [];

        if (userStory) {
            let existingLike = await this.likeStoryRepository.findOne({
                where: { story: { id: userStory.story_id }, user: { id: user.id } },
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
                media: userStory.story_media,
                isLiked: !!existingLike,
                createdAt: userStory.createdAt,
            });
        }

        for (const story of stories) {
            let existingLike = await this.likeStoryRepository.findOne({
                where: { story: { id: story.story_id }, user: { id: user.id } },
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

        // Fetch followed users' posts with pagination
        console.log(offset)
        let posts = await this.postRepository
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
            .where('f.followerId = :userId OR user.id = :userId', { userId: user.id })
            .groupBy('post.id, user.id')
            .orderBy('post.createdAt', 'DESC')
            .offset(offset)
            .cache(false) // Disable caching
            .take(limit)
            .getRawMany();

        // Fetch the total count without pagination
        const totalPosts = await this.postRepository
            .createQueryBuilder('post')
            .leftJoin('follow', 'f', 'f.followingId = post.userId')
            .where('f.followerId = :userId OR post.userId = :userId', { userId: user.id })
            .getCount();
        if (!Array.isArray(posts)){
            posts = [
                posts
            ];
        }
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
                isLiked: !!existingLike && existingLike.isLike == 1,
                isDisliked: !!existingLike && existingLike.isLike == -1,
                isSaved: !!existingSave,
            });
        }

        const hasMore = totalPosts > offset + posts.length;

        return {
            posts: finalPosts,
            stories: finalStories,
            pagination: {
                page,
                limit,
                hasMore,
            },
        };
    }
    async getUserDetails(userId: number, page: number = 1, limit: number = 10): Promise<any> {
        // Find the user by ID
        const user = await this.userRepository.findOne({
            where: {id: userId},
            relations: ['collectionEntities', 'createdNfts']
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Get collections with price information
        const collections = await this.userRepository.createQueryBuilder('user')
            .relation(User, 'collectionEntities')
            .of(user.id)
            .loadMany();

        // Fetch associated price entities for the collections
        const collectionPrices = await Promise.all(
            collections.map(async (collection) => {
                const prices = await this.userRepository.createQueryBuilder('price')
                    .where('price.collectionId = :collectionId', {collectionId: collection.id})
                    .getMany();
                return {
                    ...collection,
                    prices,
                };
            })
        );

        // Get created NFTs
        const createdNfts = user.createdNfts;

        // Create pagination result for collections
        const totalCollections = collectionPrices.length;
        const paginatedCollections = collectionPrices.slice((page - 1) * limit, page * limit);

        // Create the response object
        const response = {
            user: {
                id: user.id,
                name: user.name,
                username: user.username,
                profilePic: user.profilePic,
                bio: user.bio,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                // Add more user fields as necessary
            },
            collections: paginatedCollections.map(collection => ({
                id: collection.id,
                name: collection.name,
                prices: collection.prices.map(price => ({
                    floorPrice: price.floorPrice,
                    currency: price.currency,
                    items: price.items,
                    owners: price.owners,
                    createdAt: price.createdAt,
                })),
            })),
            createdNfts: createdNfts.map(nft => ({
                id: nft.id,
                name: nft.name,
                // Add more NFT fields as necessary
            })),
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCollections / limit),
                pageSize: limit,
                totalItems: totalCollections,
            },
        };

        return response;
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
            .leftJoinAndSelect('user.favorites', 'favorites')
            .where('user.id = :userId', {userId})
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
                caption: post.caption,
                createdAt: post.createdAt,
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
        // Fetch user-owned NFTs with artist and collection data
        const nfts = await this.nftRepository
            .createQueryBuilder('nft')
            .leftJoinAndSelect('nft.collectionEntity', 'collection')
            .leftJoinAndSelect('nft.artist', 'artist')
            .where('nft.owner.id = :userId', {userId}) // Ensure owner relationship exists in the NFT entity
            .select([
                'nft.id',
                'nft.name',
                'nft.image',
                'nft.price',
                'artist.id',
                'artist.username',
                'artist.profilePic',
                'collection.id',
                'collection.name',
                'collection.cover',
            ])
            .getRawMany();

        const ownedNfts = nfts.map(nft => ({
            id: nft.id,
            name: nft.name,
            image: nft.image,
            price: nft.price,
            artist: {
                id: nft.id,
                username: nft.username,
                profilePic: nft.profilePic,
            },
            collection: {
                id: nft.id,
                name: nft.name,
                cover: nft.cover,
            },
        }));
        // Fetch user-owned NFTs with artist and collection data
        let favoriteNFTs = [];
        if (user.favorites.length > 0) {
            const favorites = await this.nftRepository
                .createQueryBuilder('nft')
                .leftJoinAndSelect('nft.collectionEntity', 'collection')
                .leftJoinAndSelect('nft.artist', 'artist')
                .where('nft.id IN (:...favorites)', {favorites: user.favorites.map((e) => e.nftId)}) // Correct usage with array parameter
                .select([
                    'nft.id',
                    'nft.name',
                    'nft.image',
                    'nft.price',
                    'artist.id',
                    'artist.username',
                    'artist.profilePic',
                    'collection.id',
                    'collection.name',
                    'collection.cover',
                ])
                .getRawMany();
            console.log(favorites)
            favoriteNFTs = favorites.map(nft => ({
                id: nft.nft_id,
                name: nft.nft_name,
                image: nft.nft_image,
                price: parseFloat(nft.nft_price), // Convert price to a number if needed
                artist: {
                    id: nft.artist_id,
                    username: nft.artist_username,
                    profilePic: nft.artist_profilePic,
                },
                collection: {
                    id: nft.collection_id,
                    name: nft.collection_name,
                    cover: nft.collection_cover,
                },
            }));
        }
        return {
            id: user.id,
            username: user.username,
            cover: user.cover,
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
            createdAt: user.createdAt,
            ownedNfts: !isBlocked ? ownedNfts : [], // Include owned NFTs in response
            favoriteNFTs: !isBlocked ? favoriteNFTs : [], // Include owned NFTs in response

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
                {followerId: userId, followingId: user.id},
                {followerId: user.id, followingId: userId}
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

    async getFollowers(userId, self: User): Promise<Awaited<{ isFollowing: boolean; name: string; id: number; pic: string; username: string }>[]> {
        const followers = await this.followUserRepository.find({
            where: {followingId: userId},
            relations: ['follower'],
        });

        // بررسی وضعیت فالو/آنفالو برای هر فالوور
        return await Promise.all(
            followers.map(async (follow) => {
                const isFollowing = await this.followUserRepository.findOne({
                    where: {
                        followerId: self.id,
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

    async getFollowings(userId, self: User): Promise<{ isFollowing: boolean; name: string; id: number; pic: string; username: string }[]> {
        // If the userId is the same as self.id, return self's followings
        if (userId === self.id.toString()) {
            return this.getFollowingsForUser(self.id);
        }

        // Check if self is following userId
        const isFollowing = await this.followUserRepository.findOne({
            where: {followerId: self.id, followingId: userId},
        });
        console.log(isFollowing)

        // If not following, return an empty array
        if (!isFollowing) {
            return [];
        }

        // If following, return the followings for the specified userId
        return this.getFollowingsForUser(userId);
    }

    private async getFollowingsForUser(userId: number): Promise<{ isFollowing: boolean; name: string; id: number; pic: string; username: string }[]> {
        const followings = await this.followUserRepository.find({
            where: {followerId: userId},
            relations: ['following'],
        });

        return followings.map(follow => ({
            id: follow.following?.id,
            name: follow.following?.name,
            username: follow.following?.username,
            pic: follow.following.profilePic ?? "",
            isFollowing: true,
        }));
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

    async filterUsers(dto: FilterUsersDto): Promise<any> {
        const {
            days = 30,
            searchQuery,
            sortOrder,
        } = dto;

        const queryBuilder = this.userRepository
            .createQueryBuilder('user')
            .leftJoin(FollowUser, 'followerRelation', 'followerRelation.followingId = user.id') // Join for followers
            .select([
                'user.id',
                'user.name',
                'user.username',
                'user.profilePic',
                'user.cover',
                'COUNT(DISTINCT followerRelation.id) AS followersCount' // Counting followers
            ])
            .where(`user.createdAt >= NOW() - INTERVAL '${days} days'`) // Directly interpolate days into the query
        // Add search filter if searchQuery is provided
        if (searchQuery) {
            queryBuilder.andWhere('user.username ILIKE :searchQuery', {
                searchQuery: `%${searchQuery}%`,
            }).orWhere('user.name ILIKE :searchQuery', {
                searchQuery: `%${searchQuery}%`,
            });
        }

        const users = await queryBuilder
            .groupBy('user.id')
            .orderBy('user.id', sortOrder)
            .getRawMany(); // Get raw results
        console.log(users)
        return {
            users: users.map((user) => ({
                id: user.user_id,
                name: user.user_name,
                username: user.user_username,
                profilePic: user.user_profilePic,
                followers: user.followerscount,
                cover: user.user_cover,
            })),
        };
    }


}
