import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { UpdateUserDTO } from '@/User/user/dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('User')
@ApiBearerAuth()
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Fetch Homepage Data' })
  @Get('home')
  async getHomepageData(@Req() req: Request) {
    return await this.userService.getHomepageData(req.user as any);
  }

  @ApiOperation({ summary: 'Get All Reels' })
  @Get('reels')
  async getReels(@Req() req: Request) {
    return await this.userService.getReels(req.user as any);
  }

  @ApiOperation({ summary: 'Get Profile By ID' })
  @Get('profile/:id')
  @UseGuards(AuthGuard('jwt'))
  async getProfileById(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return await this.userService.getProfileById(id, req.user as any);
  }

  @ApiOperation({ summary: 'Get User Posts By ID' })
  @Get('profile/:id/posts')
  @UseGuards(AuthGuard('jwt'))
  async getPostsByUserId(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return await this.userService.getPostsForUser(id, req.user as any);
  }

  @ApiOperation({ summary: 'Follow User' })
  @ApiOkResponse({ description: 'User followed successfully', example: { statusCode: 200 } })
  @Post(':userId/follow')
  @UseGuards(AuthGuard('jwt'))
  async follow(@Param('userId', ParseIntPipe) userId: number, @Req() req: Request) {
    return await this.userService.follow(userId, req.user as any);
  }

  @ApiOperation({ summary: 'Block User' })
  @ApiOkResponse({ description: 'User blocked successfully', example: { statusCode: 200 } })
  @Post(':userId/block')
  @UseGuards(AuthGuard('jwt'))
  async blockUser(@Param('userId', ParseIntPipe) userId: number, @Req() req: Request) {
    return await this.userService.blockUser(userId, req.user as any);
  }

  @ApiOperation({ summary: 'Get Followers List' })
  @ApiOkResponse({ description: 'List of followers', example: { statusCode: 200 } })
  @Get('followers')
  @UseGuards(AuthGuard('jwt'))
  async followers(@Req() req: Request) {
    return await this.userService.getFollowers(req.user as any);
  }

  @ApiOperation({ summary: 'Get Followings List' })
  @ApiOkResponse({ description: 'List of followings', example: { statusCode: 200 } })
  @Get('followings')
  @UseGuards(AuthGuard('jwt'))
  async followings(@Req() req: Request) {
    return await this.userService.getFollowings(req.user as any);
  }

  @ApiOperation({ summary: 'Get Blocked Users List' })
  @ApiOkResponse({ description: 'List of blocked users', example: { statusCode: 200 } })
  @Get('blocked')
  @UseGuards(AuthGuard('jwt'))
  async getBlocked(@Req() req: Request) {
    return await this.userService.getBlocked(req.user as any);
  }

  @ApiOperation({ summary: 'Get Sharing List' })
  @ApiOkResponse({ description: 'List of users available for sharing', example: { statusCode: 200 } })
  @Get('sharing')
  @UseGuards(AuthGuard('jwt'))
  async sharingList(@Req() req: Request) {
    const followers = await this.userService.getFollowers(req.user as any);
    const followings = await this.userService.getFollowings(req.user as any);

    // Combine followers and followings and remove duplicates by user ID
    const combinedUsers = [...followers, ...followings];
    return Array.from(new Map(combinedUsers.map(user => [user.id, user])).values());
  }

  @ApiOperation({ summary: 'Update User Profile' })
  @ApiOkResponse({ description: 'Profile updated successfully', example: { statusCode: 200 } })
  @Post('save')
  @UseGuards(AuthGuard('jwt'))
  async update(@Body() updateUserDTO: UpdateUserDTO, @Req() req: Request) {
    const { name, bio } = updateUserDTO;
    return await this.userService.update(req.user as any, name, bio);
  }
}
