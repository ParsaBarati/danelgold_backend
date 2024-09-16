import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ForumService } from './forum.service';
import { ForumTopic } from './entity/forum-topic.entity';
import { ForumPost } from './entity/forum-post.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Forum')
@ApiBearerAuth()
@Controller('forum')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  @Post('topics')
  createTopic(@Body() createTopicDto: Partial<ForumTopic>) {
    return this.forumService.createTopic(createTopicDto);
  }

  @Get('topics')
  findAllTopics() {
    return this.forumService.findAllTopics();
  }

  @Get('topics/:id')
  findOneTopic(@Param('id') id: number) {
    return this.forumService.findOneTopic(id);
  }

  @Put('topics/:id')
  updateTopic(@Param('id') id: number, @Body() updateTopicDto: Partial<ForumTopic>) {
    return this.forumService.updateTopic(id, updateTopicDto);
  }

  @Delete('topics/:id')
  removeTopic(@Param('id') id: number) {
    return this.forumService.removeTopic(id);
  }

  @Post('posts')
  createPost(@Body() createPostDto: Partial<ForumPost>) {
    return this.forumService.createPost(createPostDto);
  }

  @Get('posts/:topicId')
  findAllPosts(@Param('topicId') topicId: number) {
    return this.forumService.findAllPosts(topicId);
  }

  @Get('posts/:id')
  findOnePost(@Param('id') id: number) {
    return this.forumService.findOnePost(id);
  }

  @Put('posts/:id')
  updatePost(@Param('id') id: number, @Body() updatePostDto: Partial<ForumPost>) {
    return this.forumService.updatePost(id, updatePostDto);
  }

  @Delete('posts/:id')
  removePost(@Param('id') id: number) {
    return this.forumService.removePost(id);
  }
}
