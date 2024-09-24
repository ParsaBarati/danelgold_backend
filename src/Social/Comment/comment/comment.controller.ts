import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { 
  ApiBearerAuth, 
  ApiConflictResponse, 
  ApiCreatedResponse, 
  ApiNotFoundResponse, 
  ApiOkResponse, 
  ApiOperation, 
  ApiQuery, 
  ApiTags 
} from '@nestjs/swagger';
import { UserRole } from '@/User/user/entity/user.entity';
import { CommentService } from './comment.service';
import { UpdateCommentDTO } from './dto/UpdateComment.dto';
import { CreateCommentDTO } from './dto/CreateComment';
import { Roles } from '@/common/decorators/roles.decorator';
import { Request } from 'express';

@ApiTags('Comment')
@ApiBearerAuth()
@Controller('comment')
export class CommentController {
  constructor(private readonly commentsService: CommentService) {}

  @ApiOperation({summary:'CommentPost'})
  @ApiCreatedResponse({description:'دیدگاه ارزشمند شما ثبت گردید',example:{statusCode:201}})
  @ApiConflictResponse({description:'دیدگاه های شما به حد نصاب رسیده اند',example:{statusCode:409}})
  @ApiNotFoundResponse({description:'دوره پیدا نشد!',example:{statusCode:404}})
  @Post('/:postId')
  async CommentPost(
    @Param('postId',ParseIntPipe) postId: number,
    @Req() req : Request,
    @Body() createCommentDTO: CreateCommentDTO,
  ) {
    const userPhone = (req.user as any).result.phone;
    return await this.commentsService.CommentPost(postId,userPhone,createCommentDTO);
  }

  @ApiOperation({summary:'CommentStory'})
  @ApiCreatedResponse({description:'دیدگاه ارزشمند شما ثبت گردید',example:{statusCode:201}})
  @ApiConflictResponse({description:'دیدگاه های شما به حد نصاب رسیده اند',example:{statusCode:409}})
  @ApiNotFoundResponse({description:'دوره پیدا نشد!',example:{statusCode:404}})
  @Post('/:storyId')
  async CommentStory(
    @Param('storyId') storyId: number,
    @Req() req : Request,
    @Body() createCommentDTO: CreateCommentDTO,
  ) {
    const userPhone = (req.user as any).result.phone;
    return await this.commentsService.CommentStory(storyId,userPhone,createCommentDTO);
  }

  @ApiOperation({summary:'Update Comment'})
  @ApiOkResponse({description:'دیدگاه شما ویرایش گردید',example:{statusCode:200}})
  @ApiNotFoundResponse({description:'کامنتی پیدا نشد!',example:{statusCode:404}})
  @Put(':commentId')
  async updateComment(
    @Param('commentId') commentId: number,
    @Req() req: Request,
    @Body() updateCommentDto: UpdateCommentDTO,
  ) {
    const currentUserPhone = (req.user as any).result.phone;    
    return await this.commentsService.updateComment(commentId,currentUserPhone,updateCommentDto);
  }

  @ApiOperation({summary:'Delete Comment'})
  @ApiOkResponse({description:'دیدگاه حذف گردید',example:{statusCode:200}})
  @ApiNotFoundResponse({description:'دیدگاه پیدا نشد',example:{statusCode:404}})
  @ApiConflictResponse({description:'دیدگاه پاسخ دارد',example:{statusCode:409}})
  @Delete(':commentId')
  async deleteComment(
    @Param('commentId') commentId: number,
    @Req() req: Request,
  ) {
  const currentUserPhone = (req.user as any).result.phone; 
    return await this.commentsService.deleteComment(commentId,currentUserPhone);
  }

  @Roles(UserRole.ADMIN)
  @Patch()
  async deleteAdminComments(
    @Body('commentIds') commentIds: number[],
  ) {
    return await this.commentsService.deleteAdminComments(commentIds);
  }

  @ApiOperation({summary:'Get All Post Comments'})
  @ApiOkResponse({description:'موفقیت آمیز',example:{statusCode:200}})
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'sortOrder', required: false })
  @ApiQuery({ name: 'postId', required: false })
  @Roles(UserRole.ADMIN)
  @Get('all/post')
  async getAllPostComments(
  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  @Query('sortBy') sort?: string,
  @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  @Query('postId') postId?: number 
  ) {
  const query = { page, limit, sort, sortOrder, postId }; 
  return await this.commentsService.getAllPostComments(query);
  }

  @ApiOperation({summary:'Get All Story Comments'})
  @ApiOkResponse({description:'موفقیت آمیز',example:{statusCode:200}})
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'sortOrder', required: false })
  @ApiQuery({ name: 'storyId', required: false })
  @Roles(UserRole.ADMIN)
  @Get('all/story')
  async getAllStoryComments(
  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  @Query('sortBy') sort?: string,
  @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  @Query('storyId') storyId?: number 
  ) {
  const query = { page, limit, sort, sortOrder, storyId }; 
  return await this.commentsService.getAllStoryComments(query);
  }

  @ApiOperation({summary:'Get Comments By Course'})
  @ApiOkResponse({description:'دیدگاه های دوره',example:{statusCode:200}})
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'sortOrder', required: false })
  @Get('/post/:id')
  async getCommentsByCourse(
    @Param('id') postId: number,
    @Req () req : Request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('sortBy') sort?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    const currentUserPhone = (req.user as any).result.phone;
    const currentUserRoles = (req.user as any).result.roles || []; 
    const query = { page, limit, sort, sortOrder };   
      return await this.commentsService.getCommentsByPost(
        postId,
        currentUserPhone,
        currentUserRoles,
        query
      );
  }

  @ApiOperation({summary:'getPostCommentsByUser'})
  @ApiOkResponse({description:'موفقیت آمیز',example:{statusCode:200}})
  @ApiNotFoundResponse({description:'کاربر بافت نشد',example:{statusCode:404}})
  @ApiQuery({ name: 'postId', required: false })
  @Get('/user/postComments')
 async getPostCommentsByUser(
  @Query('postId') postId: string | undefined,
  @Req() req: Request,
 ){
  const phone = (req.user as any).result.phone;
  const currentUserPhone = (req.user as any).result.phone;
  const parsedPostId = postId ? parseInt(postId, 10) : undefined;
  if (parsedPostId !== undefined && isNaN(parsedPostId)) {
    throw new BadRequestException('postId must be a number');
  }
  return await this.commentsService.getPostCommentsByUser(currentUserPhone, phone, parsedPostId);
 }

 @ApiOperation({summary:'getStoryCommentsByUser'})
  @ApiOkResponse({description:'موفقیت آمیز',example:{statusCode:200}})
  @ApiNotFoundResponse({description:'کاربر بافت نشد',example:{statusCode:404}})
  @ApiQuery({ name: 'storyId', required: false })
  @Get('/user/storyComments')
 async getStoryCommentsByUser(
  @Query('storyId') storyId: string | undefined,
  @Req() req: Request,
 ){
  const phone = (req.user as any).result.phone;
  const currentUserPhone = (req.user as any).result.phone;
  const parsedStoryId = storyId ? parseInt(storyId, 10) : undefined;
  if (parsedStoryId !== undefined && isNaN(parsedStoryId)) {
    throw new BadRequestException('storyId must be a number');
  }
  return await this.commentsService.getStoryCommentsByUser(currentUserPhone, phone, parsedStoryId);
 }
}
 