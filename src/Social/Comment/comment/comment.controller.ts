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
  ApiExcludeController, 
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

@ApiExcludeController()
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
    const userIdentifier = (req.user as any).result.phone || (req.user as any).result.email;
    return await this.commentsService.CommentPost(postId,userIdentifier,createCommentDTO);
  }

  @ApiOperation({summary:'CommentStory'})
  @ApiCreatedResponse({description:'دیدگاه ارزشمند شما ثبت گردید',example:{statusCode:201}})
  @ApiConflictResponse({description:'دیدگاه های شما به حد نصاب رسیده اند',example:{statusCode:409}})
  @ApiNotFoundResponse({description:'دوره پیدا نشد!',example:{statusCode:404}})
  @Post('/:storyId')
  async CommentStory(
    @Param('storyId',ParseIntPipe) storyId: number,
    @Req() req : Request,
    @Body() createCommentDTO: CreateCommentDTO,
  ) {
    const userIdentifier = (req.user as any).result.phone || (req.user as any).result.email;
    return await this.commentsService.CommentStory(storyId,userIdentifier,createCommentDTO);
  }

  @ApiOperation({summary:'Update Comment'})
  @ApiOkResponse({description:'دیدگاه شما ویرایش گردید',example:{statusCode:200}})
  @ApiNotFoundResponse({description:'کامنتی پیدا نشد!',example:{statusCode:404}})
  @Put(':commentId')
  async updateComment(
    @Param('commentId',ParseIntPipe) commentId: number,
    @Req() req: Request,
    @Body() updateCommentDto: UpdateCommentDTO,
  ) {
    const currentUserIdentifier = (req.user as any).result.phone || (req.user as any).result.email;    
    return await this.commentsService.updateComment(commentId,currentUserIdentifier,updateCommentDto);
  }

  @ApiOperation({summary:'Delete Comment'})
  @ApiOkResponse({description:'دیدگاه حذف گردید',example:{statusCode:200}})
  @ApiNotFoundResponse({description:'دیدگاه پیدا نشد',example:{statusCode:404}})
  @ApiConflictResponse({description:'دیدگاه پاسخ دارد',example:{statusCode:409}})
  @Delete(':commentId')
  async deleteComment(
    @Param('commentId',ParseIntPipe) commentId: number,
    @Req() req: Request,
  ) {
  const currentUserIdentifier = (req.user as any).result.phone || (req.user as any).result.email; 
    return await this.commentsService.deleteComment(commentId,currentUserIdentifier);
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

  @ApiOperation({summary:'Get Comments By Post'})
  @ApiOkResponse({description:'دیدگاه های دوره',example:{statusCode:200}})
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'sortOrder', required: false })
  @Get('/post/:id')
  async getCommentsByPost(
    @Param('id',ParseIntPipe) postId: number,
    @Req () req : Request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('sortBy') sort?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    const currentUserIdentifier = (req.user as any).result.phone || (req.user as any).result.email;
    const query = { page, limit, sort, sortOrder };   
      return await this.commentsService.getCommentsByPost(
        postId,
        currentUserIdentifier,
        query
      );
  }

  @ApiOperation({summary:'Get Comments By Story'})
  @ApiOkResponse({description:'دیدگاه های دوره',example:{statusCode:200}})
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'sortOrder', required: false })
  @Get('/story/:id')
  async getCommentsByStory(
    @Param('id',ParseIntPipe) storyId: number,
    @Req () req : Request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('sortBy') sort?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    const currentUserIdentifier = (req.user as any).result.phone || (req.user as any).result.email;
    const query = { page, limit, sort, sortOrder };   
      return await this.commentsService.getCommentsByStory(
        storyId,
        currentUserIdentifier,
        query
      );
  }

  @ApiOperation({summary:'getPostCommentsByUser'})
  @ApiOkResponse({description:'موفقیت آمیز',example:{statusCode:200}})
  @ApiNotFoundResponse({description:'کاربر بافت نشد',example:{statusCode:404}})
  @ApiQuery({ name: 'postId', required: false })
  @Get('/user/postComments')
 async getPostCommentsByUser(
  @Query('postId', new DefaultValuePipe(1), ParseIntPipe) postId: number | undefined,
  @Req() req: Request,
 ){
  const Identifier = (req.user as any).result.phone || (req.user as any).result.email;
  const currentUserIdentifier = (req.user as any).result.phone || (req.user as any).result.email;

  return await this.commentsService.getPostCommentsByUser(currentUserIdentifier, Identifier, postId);
 }

 @ApiOperation({summary:'getStoryCommentsByUser'})
  @ApiOkResponse({description:'موفقیت آمیز',example:{statusCode:200}})
  @ApiNotFoundResponse({description:'کاربر بافت نشد',example:{statusCode:404}})
  @ApiQuery({ name: 'storyId', required: false })
  @Get('/user/storyComments')
 async getStoryCommentsByUser(
  @Query('storyId', new DefaultValuePipe(1), ParseIntPipe) storyId: number | undefined,
  @Req() req: Request,
 ){
  const Identifier = (req.user as any).result.phone || (req.user as any).result.email;
  const currentUserIdentifier = (req.user as any).result.phone || (req.user as any).result.email;
  
  return await this.commentsService.getStoryCommentsByUser(currentUserIdentifier, Identifier, storyId);
 }
}
 