import { Controller, Delete, Get, NotFoundException, Param, Query, Post, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DashboardService } from "./dashboard.service";
import { Roles } from "@/common/decorators/roles.decorator";
import { AdminRole } from "@/User/admin/entity/admin.entity";
import { SendNotificationDto } from "@/User/dashboard/dto/notification.dto";

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('Admin/dashboard')
export class DashboardController {
    constructor(
        private readonly dashboardService: DashboardService,
    ) {}

    @Get('/')
    async dashboardInsights() {
        return {
            users: await this.dashboardService.getUserInsights(),
            posts: await this.dashboardService.getPostInsights(),
            stories: await this.dashboardService.getStoryInsights(),
        };
    }

    @ApiCreatedResponse({ description: 'List All Users By SuperAdmin' })
    @Roles(AdminRole.SUPERADMIN)
    @ApiOperation({ summary: 'Get All Users' })
    @Get('users/all')
    async getAllUsers(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('sortType') sortType: string = 'asc'
    ) {
        return this.dashboardService.getAllUsers(page, limit, sortType);
    }

    @ApiCreatedResponse({ description: 'List All Posts By SuperAdmin' })
    @Roles(AdminRole.SUPERADMIN)
    @ApiOperation({ summary: 'Get All Posts' })
    @Get('posts/all')
    async getAllPosts(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('sortType') sortType: string = 'asc'
    ) {
        return this.dashboardService.getAllPosts(page, limit, sortType);
    }

    @Delete('posts/:id')
    async deletePost(@Param('id') id: string) {
        try {
            await this.dashboardService.deletePost(id);
            return { message: 'Post deleted successfully' };
        } catch (error) {
            throw new NotFoundException('Post not found or could not be deleted');
        }
    }

    @ApiCreatedResponse({ description: 'List All Stories By SuperAdmin' })
    @Roles(AdminRole.SUPERADMIN)
    @ApiOperation({ summary: 'Get All Stories' })
    @Get('stories/all')
    async getAllStories(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('sortType') sortType: string = 'asc'
    ) {
        return this.dashboardService.getAllStories(page, limit, sortType);
    }

    @Delete('story/:id')
    async deleteStory(@Param('id') id: string) {
        try {
            await this.dashboardService.deleteStory(id);
            return { message: 'Story deleted successfully' };
        } catch (error) {
            throw new NotFoundException('Story not found or could not be deleted');
        }
    }

    @ApiCreatedResponse({ description: 'List All Notifications By SuperAdmin' })
    @Roles(AdminRole.SUPERADMIN)
    @ApiOperation({ summary: 'Get All Notifications' })
    @Get('notifications/all')
    async getAllNotifications(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('sortType') sortType: string = 'asc'
    ) {
        return this.dashboardService.getAllNotifications(page, limit, sortType);
    }

    @ApiOperation({ summary: 'Get User by ID' })
    @Roles(AdminRole.SUPERADMIN)
    @Get('users/:id')
    async getUserById(@Param('id') id: string) {
        const user = await this.dashboardService.getUserById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    @ApiOperation({ summary: 'Send Notification' })
    @Roles(AdminRole.SUPERADMIN)
    @Post('notifications/send')
    async sendNotification(@Body() sendNotificationDto: SendNotificationDto) {
        return this.dashboardService.sendNotification(sendNotificationDto);
    }
}
