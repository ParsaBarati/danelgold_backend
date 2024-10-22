import {Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards,} from '@nestjs/common';
import {UserService} from './user.service';
import {ApiBearerAuth, ApiExcludeEndpoint, ApiOkResponse, ApiOperation, ApiTags} from '@nestjs/swagger';
import {Request} from "express";
import {User} from "@/User/user/entity/user.entity";
import {UpdateUserDTO} from "@/User/user/dto/update-user.dto";
import {AuthGuard} from "@nestjs/passport";


ApiTags('User')

@ApiBearerAuth()
@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {
    }


    @ApiOperation({summary: 'HomePage'})
    @Get('home')

    async getHomepageData(
        @Req() req: Request,
    ) {
        return await this.userService.getHomepageData((req.user as any).result)
    }

    @ApiOperation({summary: 'reels'})
    @Get('reels')

    async getReels(
        @Req() req: Request,
    ) {
        return await this.userService.getHomepageData((req.user as any).result)
    }

    @ApiOperation({summary: 'Profile By ID'})
    @Get('profile/:id')
    async getProfileById(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: Request,
    ) {
        return await this.userService.getProfileById(id, (req.user as any).result)
    }

    @ApiOperation({summary: 'Follow'})
    @ApiOkResponse({description: 'Followed', example: {statusCode: 200}})
    @Post('/:userId/follow')
    @UseGuards(AuthGuard('jwt'))

    async follow(
        @Param('userId', ParseIntPipe) userId: number,
        @Req() req: Request,
    ) {

        return await this.userService.follow(userId, (req.user as any).result);
    }

    @ApiExcludeEndpoint()
    @ApiOperation({summary: 'Get User Data'})
    @Get('user/:Identifier')
    async getUser(
        @Param('Identifier') Identifier: string
    ) {
        return await this.userService.getUser(Identifier);
    }

    @ApiExcludeEndpoint()
    @ApiOperation({summary: 'Get All Users'})
    @Get('all')
    async getAllUsers() {
        return this.userService.getAllUsers();
    }


    @ApiOperation({summary: 'Update Profile'})
    @ApiOkResponse({description: 'Updated', example: {statusCode: 200}})
    @Post('/save')
    @UseGuards(AuthGuard('jwt'))

    async update(
        @Body() updateUserDTO: UpdateUserDTO,
        @Req() req: Request,
    ) {
        const {name, bio} = updateUserDTO;

        return await this.userService.update((req.user as any).result, name, bio,);
    }
}
