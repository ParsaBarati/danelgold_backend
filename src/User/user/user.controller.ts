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
        return await this.userService.getHomepageData((req.user as any))
    }

    @ApiOperation({summary: 'reels'})
    @Get('reels')

    async getReels(
        @Req() req: Request,
    ) {
        return await this.userService.getHomepageData((req.user as any))
    }

    @ApiOperation({summary: 'Profile By ID'})
    @Get('profile/:id')
    async getProfileById(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: Request,
    ) {
        return await this.userService.getProfileById(id, (req.user as any))
    }

    @ApiOperation({summary: 'Follow'})
    @ApiOkResponse({description: 'Followed', example: {statusCode: 200}})
    @Post('/:userId/follow')
    @UseGuards(AuthGuard('jwt'))

    async follow(
        @Param('userId', ParseIntPipe) userId: number,
        @Req() req: Request,
    ) {

        return await this.userService.follow(userId, (req.user as any));
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
        console.log('User: ',req.user)
        return await this.userService.update(req.user as any, name, bio,);
    }
}
