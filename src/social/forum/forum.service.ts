import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForumPost } from '@/social/forum/entity/forum-post.entity';
import { ApiResponses, createResponse } from '@/utils/response.util';
import { User } from '@/user/user/entity/user.entity';
import { PaginationResult, PaginationService } from '@/common/paginate/pagitnate.service';
import { ForumTopic } from '@/social/forum/entity/forum-topic.entity';
import { CreateTopicDto } from '@/social/forum/dto/createTopic.dto';
import { UpdateTopicDto } from '@/social/forum/dto/updateTopic.dto';

@Injectable()
export class ForumService {
  constructor(
    @InjectRepository(ForumTopic)
    private topicsRepository: Repository<ForumTopic>,
    @InjectRepository(ForumPost)
    private postsRepository: Repository<ForumPost>,
    @InjectRepository(User)
    private userRepository: Repository<User>,

    private readonly paginationService: PaginationService
  ) {}

  async createTopic(
    userIdentifier: string,
    createTopicDto: CreateTopicDto
  ):Promise<ApiResponses<ForumTopic>>{

    const { title, content } = createTopicDto;

    const user = await this.userRepository.findOne({
      where: [{ phone: userIdentifier }, { email: userIdentifier}]
    })

    if(!user){
      throw new NotFoundException('User not found')
    }

    const topic = {
      title,
      user,
      content,
      createdAt: new Date()
    }

    const savedTopic = await this.topicsRepository.save(topic);

    return createResponse(201,savedTopic);
  }

  async createPost(
    userIdentifier:string, 
    content: string
  ):Promise<ApiResponses<ForumPost>>{

    const user = await this.userRepository.findOne({
      where: [{ phone: userIdentifier }, { email: userIdentifier }]
    })

    if(!user){
      throw new NotFoundException('User not found')
    }

    
    const post = {
      user,
      content,
      createAt: new Date()
    }

    const savedPost = await this.postsRepository.save(post);

    return createResponse(201,savedPost);
  }

  async updateTopic(
    topicId: number,
    currentUserIdentifier: string, 
    updateTopicDto: UpdateTopicDto
  ):Promise<ApiResponses<ForumTopic>> {
    
    const topic = await this.topicsRepository.findOneBy({ id: topicId });

    if(!topic){
      throw new NotFoundException('تاپیک یافت نشد')
    }

    if(topic.user.phone !== currentUserIdentifier && topic.user.email !== currentUserIdentifier){
      throw new UnauthorizedException('شما مجاز به ویرایش نیستید')
    }

    topic.title = updateTopicDto.title;
    topic.content = updateTopicDto.content;

    topic.updatedAt = new Date();

    const updatedTopic = await this.topicsRepository.save(topic);

    return createResponse(200,updatedTopic);
  }

  async updatePost(
    postId: number,
    currentUserIdentifier: string,
    content?: string
  ):Promise<ApiResponses<ForumPost>>{

    const post = await this.postsRepository.findOneBy({ id: postId });

    if(!post){
      throw new NotFoundException('پست در فروم یافت نشد')
    }

    if(post.user.phone !== currentUserIdentifier && post.user.email !== currentUserIdentifier){
      throw new UnauthorizedException('شما مجاز به ویرایش نیستید')
    }

    if(content){
      post.content = content
    }

    post.updatedAt = new Date();

    const updatedPost = await this.postsRepository.save(post);

    return createResponse(200,updatedPost);
  }

  async getAllTopics(
    query: any
  ):Promise<ApiResponses<PaginationResult<any>>>{

    const {
      page = 1,
      limit = 10,
      search,
      sort = 'id',
      sortOrder = 'DESC',
    } = query;

    const queryBuilder = this.topicsRepository
      .createQueryBuilder('topics')
      .select([
        'topics.id',
        'topics.title',
        'topics.userIdentifier',
        'topics.content',
        'topics.createdAt',
        'topics.updatedAt'
      ])
      .orderBy(`topics.${sort}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit)

      const paginationResult = await this.paginationService.paginate(
        queryBuilder,
        page,
        limit,
      );

      if(search){
        queryBuilder.andWhere('(topics.content ILKE :search)',
          {search: `%${search}%`}
        )
      }

      return createResponse(200,paginationResult)
  }

  async getAllPosts(
    query: any
  ):Promise<ApiResponses<PaginationResult<any>>>{

    const {
      page = 1,
      limit = 10,
      search,
      sort = 'id',
      sortOrder = 'DESC',
    } = query;

    const queryBuilder = this.postsRepository
      .createQueryBuilder('forumPosts')
      .select([
        'forumPosts.id',
        'forumPosts.userIdentifier',
        'forumPosts.content',
        'forumPosts.createdAt',
        'forumPosts.updatedAt'
      ])
      .orderBy(`forumPosts.${sort}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit)

      const paginationResult = await this.paginationService.paginate(
        queryBuilder,
        page,
        limit,
      );

      if(search){
        queryBuilder.andWhere('(forumPosts.content ILKE :search)',
          {search: `%${search}%`}
        )
      }

      return createResponse(200,paginationResult)
  }
}
