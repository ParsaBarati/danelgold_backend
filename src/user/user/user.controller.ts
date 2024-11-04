import {Body, Controller, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards} from '@nestjs/common';
import {UserService} from '@/user/user/user.service';
import {ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags} from '@nestjs/swagger';
import {Request} from 'express';
import {UpdateUserDTO} from '@/user/user/dto/update-user.dto';
import {AuthGuard} from '@nestjs/passport';
import { FilterUsersDto } from './dto/filter-user.dto';

@ApiTags('User')
@ApiBearerAuth()
@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @ApiOperation({summary: 'Fetch Homepage Data'})
    @Get('home')
    async getHomepageData(@Req() req: Request) {
        return await this.userService.getHomepageData(req.user as any);
    }

    @ApiOperation({summary: 'Get All Reels'})
    @Get('reels')
    async getReels(@Req() req: Request) {
        return await this.userService.getReels(req.user as any);
    }

    @ApiOperation({ summary: 'Account base on api' })
    @ApiQuery({ name: 'page', required: true, type: Number })
    @ApiQuery({ name: 'limit', required: true, type: Number })
    @Get('account/:id/details')
    async getUserDetails(
        @Param('id') id: number,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        return this.userService.getUserDetails(id, page, limit);
    }

    @ApiOperation({summary: 'Get Profile By ID'})
    @Get('profile/:id')
    @UseGuards(AuthGuard('jwt'))
    async getProfileById(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
        return await this.userService.getProfileById(id, req.user as any);
    }

    @ApiOperation({summary: 'Get User Posts By ID'})
    @Get('profile/:id/posts')
    @UseGuards(AuthGuard('jwt'))
    async getPostsByUserId(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
        return await this.userService.getPostsForUser(id, req.user as any);
    }

    @ApiOperation({ summary: 'filter Users base on Api' })
    @Post('filter')
    async filterUsers(@Body() dto: FilterUsersDto) {
        return this.userService.filterUsers(dto);
    }

    @ApiOperation({summary: 'Follow User'})
    @ApiOkResponse({description: 'User followed successfully', example: {statusCode: 200}})
    @Post(':userId/follow')
    @UseGuards(AuthGuard('jwt'))
    async follow(@Param('userId', ParseIntPipe) userId: number, @Req() req: Request) {
        return await this.userService.follow(userId, req.user as any);
    }

    @ApiOperation({summary: 'Block User'})
    @ApiOkResponse({description: 'User blocked successfully', example: {statusCode: 200}})
    @Post(':userId/block')
    @UseGuards(AuthGuard('jwt'))
    async blockUser(@Param('userId', ParseIntPipe) userId: number, @Req() req: Request) {
        return await this.userService.blockUser(userId, req.user as any);
    }

    @ApiOperation({summary: 'Get Followers List'})
    @ApiOkResponse({description: 'List of followers', example: {statusCode: 200}})
    @Get('followers/:userId?')
    @UseGuards(AuthGuard('jwt'))
    async followers(@Req() req: Request, @Param('userId') userId?: string) {
        // Use `userId` if provided, otherwise default to the authenticated user's ID
        const targetUserId = userId || (req.user as any).id;
        return await this.userService.getFollowers(targetUserId, (req.user as any));
    }


    @ApiOperation({summary: 'Get Followings List'})
    @ApiOkResponse({description: 'List of followings', example: {statusCode: 200}})
    @Get('followings/:userId?')
    @UseGuards(AuthGuard('jwt'))
    async followings(@Req() req: Request, @Param('userId') userId?: string) {
        // Use `userId` if provided, otherwise default to the authenticated user's ID
        const targetUserId = userId || (req.user as any).id;
        return await this.userService.getFollowings(targetUserId, (req.user as any));
    }


    @ApiOperation({summary: 'Get Blocked Users List'})
    @ApiOkResponse({description: 'List of blocked users', example: {statusCode: 200}})
    @Get('blocked')
    @UseGuards(AuthGuard('jwt'))
    async getBlocked(@Req() req: Request) {
        return await this.userService.getBlocked(req.user as any);
    }

    @ApiOperation({summary: 'Get Sharing List'})
    @ApiOkResponse({description: 'List of users available for sharing', example: {statusCode: 200}})
    @Get('sharing')
    @UseGuards(AuthGuard('jwt'))
    async sharingList(@Req() req: Request) {
        const user = req.user as any;
        const followers = await this.userService.getFollowers(user.id, user);
        const followings = await this.userService.getFollowings(user.id, user);

        // Combine followers and followings and remove duplicates by user ID
        const combinedUsers = [...followers, ...followings];
        return Array.from(new Map(combinedUsers.map(user => [user.id, user])).values());
    }

    @ApiOperation({summary: 'Update User Profile'})
    @ApiOkResponse({description: 'Profile updated successfully', example: {statusCode: 200}})
    @Post('save')
    @UseGuards(AuthGuard('jwt'))
    async update(@Body() updateUserDTO: UpdateUserDTO, @Req() req: Request) {
        const {name, bio} = updateUserDTO;
        return await this.userService.update(req.user as any, name, bio);
    }
}
