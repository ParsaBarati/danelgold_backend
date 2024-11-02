import {Controller, Delete, Get, NotFoundException, Param, Query} from '@nestjs/common';
import {ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags,} from '@nestjs/swagger';
import {DashboardService} from "@/user/dashboard/dashboard.service";
import {Roles} from "@/common/decorators/roles.decorator";
import {AdminRole} from "@/user/admin/entity/admin.entity";


@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('Admin/dashboard')
export class DashboardController {
    constructor(
        private readonly dashboardService: DashboardService,
    ) {
    }

    @Get('/')
    async dashboardInsights() {
        return {
            users: await this.dashboardService.getUserInsights(),
            posts: await this.dashboardService.getPostInsights(),
            stories: await this.dashboardService.getStoryInsights(),
        };
    }

    @ApiCreatedResponse({description: 'List All Users By SuperAdmin'})
    @Roles(AdminRole.SUPERADMIN)
    @ApiOperation({summary: 'Get All Users'})
    @Get('users/all')
    async getAllUsers(
        @Query('page') page: number = 1,  // Default page number
        @Query('limit') limit: number = 10 // Default limit for users per page
    ) {
        return this.dashboardService.getAllUsers(page, limit);
    }

    @ApiCreatedResponse({description: 'List All Posts By SuperAdmin'})
    @Roles(AdminRole.SUPERADMIN)
    @ApiOperation({summary: 'Get All Posts'})
    @Get('posts/all') // Change the endpoint to 'posts/all'
    async getAllPosts(
        @Query('page') page: number = 1,  // Default page number
        @Query('limit') limit: number = 10 // Default limit for posts per page
    ) {
        return this.dashboardService.getAllPosts(page, limit); // Change to getAllPosts
    }

    @Delete('posts/:id')
    async deletePost(@Param('id') id: string) {
        try {
            await this.dashboardService.deletePost(id);
            return {message: 'Post deleted successfully'};
        } catch (error) {
            throw new NotFoundException('Post not found or could not be deleted');
        }
    }

    @ApiCreatedResponse({description: 'List All Stories By SuperAdmin'})
    @Roles(AdminRole.SUPERADMIN)
    @ApiOperation({summary: 'Get All Stories'})
    @Get('stories/all')
    async getAllStories(
        @Query('page') page: number = 1, // Default page number
        @Query('limit') limit: number = 10 // Default limit for stories per page
    ) {
        return this.dashboardService.getAllStories(page, limit); // Change to getAllStories
    }

    @Delete('story/:id') // Change to handle story deletion
    async deleteStory(@Param('id') id: string) {
        try {
            await this.dashboardService.deleteStory(id); // Change to deleteStory
            return {message: 'Story deleted successfully'};
        } catch (error) {
            throw new NotFoundException('Story not found or could not be deleted');
        }
    }

    @ApiCreatedResponse({ description: 'List All Notifications By SuperAdmin' })
    @Roles(AdminRole.SUPERADMIN)
    @ApiOperation({ summary: 'Get All Notifications' })
    @Get('notifications/all')
    async getAllNotifications(
        @Query('page') page: number = 1, // Default page number
        @Query('limit') limit: number = 10 // Default limit for notifications per page
    ) {
        return this.dashboardService.getAllNotifications(page, limit); // Change to getAllNotifications
    }
}
