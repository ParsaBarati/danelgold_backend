import { Controller, Get, Post, Put, Body, Param, Req, ParseIntPipe, Query, DefaultValuePipe } from '@nestjs/common';
import { ForumService } from './forum.service';
import { ApiBearerAuth, ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CreateTopicDto } from './dto/createTopic.dto';
import { UpdateTopicDto } from './dto/updateTopic.dto';

@ApiExcludeController()
@Controller('forum')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}


  @Post('topic')
  async createTopic(
    @Req() req:Request,
    @Body() createTopicDto: CreateTopicDto
  ){
    const userPhone = (req.user as any).result.phone;
    return await this.forumService.createTopic(userPhone,createTopicDto)
  }

  @Post('forumPost')
  async createPost(
    @Req() req:Request,
    @Body() content: string
  ){
    const userPhone = (req.user as any).result.phone;
    return await this.forumService.createPost(userPhone,content)
  }

  @Put('topic/:id')
  async updateTopic(
    @Param('topicId',ParseIntPipe) topicId:number,
    @Req() req:Request,
    @Body() updateTopicDto: UpdateTopicDto
  ){
    const currentUserPhone = (req.user as any).result.phone;
    return await this.forumService.updateTopic(
      topicId,
      currentUserPhone,
      updateTopicDto
    )
  }

  @Put('forumPost/:id')
  async updatePost(
    @Param('postId',ParseIntPipe) postId:number,
    @Req() req:Request,
    @Body() content?: string
  ){
    const currentUserPhone = (req.user as any).result.phone;
    return await this.forumService.updatePost(
      postId,
      currentUserPhone,
      content
    )
  }

  @Get('allTopics')
  async getAllTopics(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('sortBy') sort?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ){
    const query = { page, limit, search, sort, sortOrder };
    return await this.forumService.getAllTopics(query)
  }

  @Get('allPosts')
  async getAllPosts(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('sortBy') sort?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ){
    const query = { page, limit, search, sort, sortOrder };
    return await this.forumService.getAllPosts(query)
  }
}
