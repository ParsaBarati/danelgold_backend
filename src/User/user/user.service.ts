import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm/index';
import {User} from '@/User/user/entity/user.entity';
import {ApiResponses, createResponse} from '@/utils/response.util';
import {UserInformation} from '@/User/user/interface/userInformation.interface';
import {Token} from '@/User/auth/token/entity/token.entity';
import {SmsService} from '@/services/sms.service';
import {Post} from '@/Social/Post/posts/entity/posts.entity';
import {Story} from '@/Social/Story/stories/entity/stories.entity';
import {Club} from '@/Social/Club/entity/club.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Story)
    private readonly storyRepository: Repository<Story>,
    @InjectRepository(Club)
    private readonly clubRepository: Repository<Club>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly smsService: SmsService,
  ) {}

  async getUser(Identifier: string): Promise<ApiResponses<UserInformation>> {
    const user = await this.userRepository.findOne({
      where: [{ phone: Identifier}, { email: Identifier }]
    });

    if (!user) {
      throw new NotFoundException('کاربر یافت نشد');
    }

    const userInformation: UserInformation = {
      id: user.id,
      phone: user.phone,
      email: user.email,
      name:user.name,
      username: user.username,
      profilePic: user.profilePic,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    const result = userInformation;
    return createResponse(200, result, null);
  }

  async getHomepageData(): Promise<any> {
    const stories = await this.storyRepository
      .createQueryBuilder('stories')
      .leftJoinAndSelect('stories.user', 'user')
      .select([
        'stories.id AS story_id',
        'stories.thumbnail AS story_thumbnail',
        'user.id AS user_id',
        'user.name AS user_name',
        'user.profilePic AS user_profilePic',
        'user.username AS user_username',
        'stories.mediaUrl AS story_media', // Assuming media is a JSON or array column
      ])
      .where('stories.expiresAt IS NULL OR stories.expiresAt > :now', { now: new Date() })
      .orderBy('stories.createdAt', 'DESC')
      .limit(10)
      .getRawMany();

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
        'user.id AS user_id',
        'user.name AS user_name',
        'user.profilePic AS user_profilePic',
        'user.username AS user_username',
        'COUNT(comments.id) AS comments_count',
        'COUNT(postLikes.id) AS like_count',
        'post.createdAt AS createdAt',
      ])
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

    return {
      stories: stories.map((story) => ({
        id: story.story_id,
        user: {
          id: story.user_id,
          name: story.user_name,
          pic: story.user_profilePic,
          username: story.user_username,
        },
        thumb: story.story_thumbnail,
        media: story.story_media, // Ensure this is an array of URLs
      })),
      posts: posts.map((post) => ({
        id: post.post_id,
        user: {
          id: post.user_id,
          name: post.user_name,
          pic: post.user_profilePic,
          username: post.user_username,
        },
        caption: post.post_caption,
        img: post.post_mediaUrl,
        likes: post.post_likes,
        dislikes: post.post_dislikes,
        commentsCount: post.comments_count,
        sharesCount: 0, // If you have a share count, replace this
        comments: [], // You'll need to fetch and structure comments separately if needed
        createdAt: post.createdAt,
        isLiked: false, // Set based on your logic
        club: club ? {
          id: club.club_id,
          name: club.club_name,
          image: club.club_cover,
          memberCount: club.club_memberCount,
        } : null,
        content: [], // Structure for additional images if needed
      })),
    };
  }

  async getProfileById(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: [
        'userDetail',
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

    // Correct the 'where' condition for follow counts
    const followersCount = await this.userRepository.count({
      where: { following: { id: userId } }, // Referencing the 'User' object here
    });

    const followingCount = await this.userRepository.count({
      where: { followers: { id: userId } }, // Referencing the 'User' object here
    });

    const posts = user.posts.map(post => ({
      id: post.id,
      thumb: post.mediaUrl,
    }));

    const stories = user.stories.map(story => ({
      id: story.id,
      thumb: story.thumbnail,
      createdAt: story.createdAt,
    }));

    const notifications = user.sentNotifications;

    const supportTickets = user.supportTickets;

    return {
      id: user.id,
      username: user.username,
      profilePic: user.profilePic,
      followers: followersCount,
      following: followingCount,
      bio: user.userDetail ? user.userDetail : null,
      stories,
      notifications: user.sentNotifications,
      supportTickets: supportTickets.map(ticket => ({
        id: ticket.id,
        title: ticket.title,
        status: ticket.status,
        createdAt: ticket.createdAt,
      })),
      settings: notifications ? notifications : null,
    };
  }

  async getAllUsers() {
    const users = await this.userRepository.find({
        select: ['username', 'name' ,'id', 'profilePic', 'createdAt'], // Adjust fields as necessary
    });

    return {
        statusCode: 200,
        result: users,
    };
}
}
