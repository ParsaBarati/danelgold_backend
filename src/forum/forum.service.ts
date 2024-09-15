import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForumTopic } from './entity/forum-topic.entity';
import { ForumPost } from './entity/forum-post.entity';

@Injectable()
export class ForumService {
  constructor(
    @InjectRepository(ForumTopic)
    private topicsRepository: Repository<ForumTopic>,
    @InjectRepository(ForumPost)
    private postsRepository: Repository<ForumPost>,
  ) {}

  // Forum Topic Services
  createTopic(topicData: Partial<ForumTopic>): Promise<ForumTopic> {
    const topic = this.topicsRepository.create(topicData);
    return this.topicsRepository.save(topic);
  }

  findAllTopics(): Promise<ForumTopic[]> {
    return this.topicsRepository.find({ relations: ['user', 'posts'] });
  }

  findOneTopic(id: number): Promise<ForumTopic> {
    return this.topicsRepository.findOne({ where: { id }, relations: ['user', 'posts'] });
  }

  updateTopic(id: number, updateData: Partial<ForumTopic>): Promise<any> {
    return this.topicsRepository.update(id, updateData);
  }

  removeTopic(id: number): Promise<any> {
    return this.topicsRepository.delete(id);
  }

  // Forum Post Services
  createPost(postData: Partial<ForumPost>): Promise<ForumPost> {
    const post = this.postsRepository.create(postData);
    return this.postsRepository.save(post);
  }

  findAllPosts(topicId: number): Promise<ForumPost[]> {
    return this.postsRepository.find({ where: { topic: { id: topicId } }, relations: ['user', 'topic'] });
  }

  findOnePost(id: number): Promise<ForumPost> {
    return this.postsRepository.findOne({ where: { id }, relations: ['user', 'topic'] });
  }

  updatePost(id: number, updateData: Partial<ForumPost>): Promise<any> {
    return this.postsRepository.update(id, updateData);
  }

  removePost(id: number): Promise<any> {
    return this.postsRepository.delete(id);
  }
}
