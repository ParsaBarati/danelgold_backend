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

  async signupUser(createUserDTO: SignupDto) {
    const existingUser = await this.userRepository.findOne({
      where: { phone: createUserDTO.phone },
    });

    if (existingUser) {
      throw new BadRequestException(
        'کاربری با این شماره همراه قبلاً حساب کاربری ساخته است',
      );
    }

    const NewUser = this.userRepository.create({
      ...createUserDTO,
    });

    const result = await this.userRepository.save(NewUser);
    return result;
  }

  async createUser(createUserDTO: CreateUserByAdminDTO) {
    const existingUser = await this.userRepository.findOne({
      where: { phone: createUserDTO.phone },
    });

    if (existingUser) {
      throw new BadRequestException(
        'کاربری با این شماره همراه قبلاً حساب کاربری ساخته است',
      );
    }

    const hashedPassword = await bcrypt.hash(createUserDTO.password, 10);

    const NewUser = this.userRepository.create({
      ...createUserDTO,
      password: hashedPassword,
      createdAt: new Date(),
    });

    const result = await this.userRepository.save(NewUser);

    if (createUserDTO.isSms) {
      await this.smsService.sendSignUpSMS(
        createUserDTO.phone,
        createUserDTO.phone,
        createUserDTO.password,
      );
    }

    return createResponse(201, result, 'کاربر با موفقیت ایجاد گردید');
  }

  async updateUser(
    phone: string,
    updateUserDTO: UpdateUserDTO,
  ): Promise<ApiResponses<User>> {
    const existingUser = await this.userRepository.findOne({
      where: { phone: phone },
    });

    if (!existingUser) {
      throw new NotFoundException('کاربر یافت نشد');
    }

    const hashedPassword = updateUserDTO.password
      ? await bcrypt.hash(updateUserDTO.password, 10)
      : existingUser.password;

    Object.assign(existingUser, {
      ...updateUserDTO,
      password: hashedPassword,
      updatedAt: new Date(),
    });

    const updateUser = await this.userRepository.save(existingUser);
    return createResponse(200, updateUser, 'آپدیت شد');
  }

  async deleteUsers(phone: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { phone } });
    if (!user) {
      throw new NotFoundException('کاربر یافت نشد');
    }
    
    await this.userRepository.manager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager.delete(Subscribe, {
          userPhone: phone,
        });
        await transactionalEntityManager.delete(User, { phone });
      },
    );

    return 'کاربر با موفقیت پاک شد';
  }

  async getUserByPhone(phone: string): Promise<ApiResponses<UserInformation>> {
    const user = await this.userRepository.findOneBy({ phone });

    if (!user) {
      throw new NotFoundException('کاربر یافت نشد');
    }

    const userInformation: UserInformation = {
      id: user.id,
      phone: user.phone,
      profilePic: user.profilePic,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    const result = userInformation;
    return createResponse(200, result, null);
  }

  async getUsers(
    page: number = 1,
    limit: number = 10,
    searchInput?: string,
    role?: string,
    all?: string,
    sort: string = 'id',
    sortOrder: 'ASC' | 'DESC' = 'DESC',
  ): Promise<ApiResponses<PaginationResult<any>>> {
    const allowedSortFields = [
      'id',
      'firstName',
      'lastName',
      'phone',
      'roles',
      'grade',
      'lastLogin',
      'skuTest',
    ];

    const validatedSortBy = allowedSortFields.includes(sort) ? sort : 'id';

    let queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userDetail', 'userDetail')
      .select([
        'user.id as id',
        'user.firstName as firstName',
        'user.lastName as lastName',
        'user.phone as phone',
        'user.role as role',
        'user.grade as grade',
        'user.lastLogin as lastLogin',
        'MAX(userDetail.ip) as ip',
        'MAX(userDetail.platform) as platform',
        'MAX(userDetail.browser) as browser',
        'MAX(userDetail.versionBrowser) as versionBrowser',
        'MAX(userDetail.versionPlatform) as versionPlatform',
        'MAX(userDetail.loginDate) as lastLoginDate',
      ])
      .groupBy(
        'user.id, user.firstName, user.lastName, user.phone, user.role, user.lastLogin',
      )
      .orderBy(`user.${validatedSortBy}`, sortOrder);

    if (searchInput) {
      queryBuilder = queryBuilder.andWhere(
        `(CONCAT(user.firstName, ' ', user.lastName) ILIKE :searchInput OR user.phone ILIKE :searchInput)`,
        { searchInput: `%${searchInput}%` },
      );
    }

    if (role !== undefined && role !== '') {
      queryBuilder = queryBuilder.andWhere('user.role = :role', { role });
    }

    if (all === 'true') {
      const users = await queryBuilder.getRawMany();
      const response = {
        data: users,
        total: users.length,
        totalPages: 1,
        page: 1,
        limit: users.length,
      };

      return createResponse(200, response);
    }

    const offset = (page - 1) * limit;
    queryBuilder = queryBuilder.skip(offset).take(limit);
    const users = await queryBuilder.getRawMany();

    const total = await this.userRepository.count();
    const totalPages = Math.ceil(total / limit);
    const response = {
      data: users,
      total,
      totalPages,
      page,
      limit,
    };

    return createResponse(200, response);
  }

  async getUserDataWithToken(userPhone: string) {
    const existingUser = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.subscribes', 'subscribe')
      .leftJoin('user.userDetail', 'userDetail')
      .where('user.phone = :phone', { phone: userPhone })
      .orderBy('userDetail.loginDate', 'DESC')
      .select([
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.phone',
        'user.profilePic',
        'user.createdAt',
        'user.updatedAt',
        'user.lastLogin',
        'userDetail.ip',
        'userDetail.platform',
        'userDetail.browser',
        'userDetail.versionBrowser',
        'userDetail.versionPlatform',
        'userDetail.loginDate',
        'subscribe.isActive',
      ])
      .limit(1)
      .getOne();

    if (existingUser) {
      return existingUser;
    } else {
      return { error: 'کاربری با این شماره پیدا نشد', status: 404 };
    }
  }

  async editDataUser(authHeader: string, editData: editDateUser) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('توکن وجود ندارد');
    }

    const token = authHeader.split(' ')[1];

    const tokenData = await this.tokenRepository
      .createQueryBuilder('token')
      .leftJoin('token.user', 'user')
      .where('token.token = :token', { token })
      .select(['token.token', 'user.phone'])
      .getOne();

    if (!tokenData) {
      throw new UnauthorizedException('توکن اشتباه است');
    }

    const updateData: Partial<User> = {
      updatedAt: new Date(),
    };
    if (editData.profilePic !== undefined) {
      updateData.profilePic = editData.profilePic;
    }

    if (Object.keys(updateData).length > 1) {
      const updatedUser = await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set(updateData)
        .where('phone = :phone', { phone: tokenData.user.phone })
        .returning([
          'phone',
          'firstName',
          'lastName',
          'profilePic',
          'updatedAt',
        ])
        .execute();

      const updatedUserData = updatedUser.raw[0];
      delete updatedUserData.password;

      return {
        message: 'با موفقیت بروز شد',
        user: updatedUserData,
        status: 200,
      };
    } else {
      const currentUser = await this.userRepository.findOne({
        where: { phone: tokenData.user.phone },
      });

      if (!currentUser) {
        throw new NotFoundException('کاربری با این شناسه یافت نشد');
      }

      delete currentUser.password;

      return { message: 'بدون تغییرات', user: currentUser, status: 200 };
    }
  }

  async getHomepageData(): Promise<any> {

    const stories = await this.storyRepository
      .createQueryBuilder('story')
      .leftJoinAndSelect('story.user', 'user')
      .select([
        'story.id',
        'story.thumbnail',
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.profilePic',
        'user.userName',
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
        'user.firstName',
        'user.lastName',
        'user.profilePic',
        'user.userName',
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
          name: `${story.user_firstName} ${story.user_lastName}`,
          pic: story.user_profilePic,
          username: story.user_username,
        },
      })),
      posts: posts.map((post) => ({
        id: post.post_id,
        thumb: post.post_mediaUrl,
        user: {
          id: post.user_id,
          name: `${post.user_firstName} ${post.user_lastName}`,
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
      username: user.userName,
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
