import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/index';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '@/User/user/entity/user.entity';
import { SignupDto } from '@/User/auth/dto/signup-dto';
import { UpdateUserDTO } from '@/User/user/dto/update-user.dto';
import { ApiResponses, createResponse } from '@/utils/response.util';
import { UserInformation } from '@/User/user/interface/userInformation.interface';
import { Subscribe } from '@/User/subscribe/entity/subscribe.entity';
import { Token } from '@/User/auth/token/entity/token.entity';
import { SmsService } from '@/services/sms.service';
import { editDateUser } from '@/User/user/dto/edit-user-date.dto';
import { CreateUserByAdminDTO } from './dto/create-user.dto';
import { PaginationResult } from '@/common/paginate/pagitnate.service';
import { Post } from '@/Social/Post/posts/entity/posts.entity';
import { Story } from '@/Social/Story/stories/entity/stories.entity';
import { Club } from '@/Social/Club/entity/club.entity';

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

  async getUserByPhone(Identifier: string): Promise<ApiResponses<UserInformation>> {
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
      profilePic: user.profilePic,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    const result = userInformation;
    return createResponse(200, result, null);
  }

  async getHomepageData(): Promise<any> {

    const stories = await this.storyRepository
      .createQueryBuilder('story')
      .leftJoinAndSelect('story.user', 'user')
      .select([
        'story.id',
        'story.thumbnail',
        'user.id',
        'user.username',
        'user.profilePic',
        'user.username',
      ])
      .where('story.expiresAt > :now', { now: new Date() }) 
      .orderBy('story.createdAt', 'DESC')
      .limit(10) 
      .getRawMany();
  
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.postLikes', 'postLikes')
      .leftJoinAndSelect('post.comments', 'comments')
      .select([
        'post.id',
        'post.mediaUrl',
        'post.caption',
        'post.likes',
        'post.dislikes',
        'user.id',
        'user.username',
        'user.profilePic',
        'user.username',
        'COUNT(comments.id) as commentCount',
        'COUNT(postLikes.id) as likeCount',
      ])
      .groupBy('post.id, user.id') 
      .orderBy('post.createdAt', 'DESC')
      .limit(10) 
      .getRawMany();
  
    const club = await this.clubRepository
      .createQueryBuilder('club')
      .select([
        'club.id',
        'club.name',
        'club.memberCount',
        'club.cover',
        'club.link',
      ])
      .where('club.id = :id', { id: 1 }) 
      .getRawOne();
  
    const transformedData = {
      stories: stories.map((story) => ({
        id: story.story_id,
        thumb: story.story_thumbnail,
        user: {
          id: story.user_id,
          name: `${story.user_username}`,
          pic: story.user_profilePic,
          username: story.user_username,
        },
      })),
      posts: posts.map((post) => ({
        id: post.post_id,
        thumb: post.post_mediaUrl,
        user: {
          id: post.user_id,
          name: `${post.user_username}`,
          pic: post.user_profilePic,
          username: post.user_username,
        },
        actions: {
          isSaved: false, 
          isLiked: post.likeCount > 0,
          isDisliked: false,
          qr: null, 
          buy: null,
        },
        counts: {
          likes: post.likeCount,
          comments: post.commentCount,
          shares: 0, 
          disliked: post.post_dislikes,
        },
        likedBy: '', 
        caption: post.post_caption,
      })),
      club: club
        ? {
            id: club.club_id,
            name: club.club_name,
            memberCount: club.club_memberCount,
            cover: club.club_cover,
            link: club.club_link,
          }
        : null,
    };
  
    return transformedData;
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
  
  
}
