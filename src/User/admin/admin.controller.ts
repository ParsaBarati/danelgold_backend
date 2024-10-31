import {Body, Controller, Get, Param, Patch, Post, Req, UseGuards} from '@nestjs/common';
import {Public} from '@/common/decorators/public.decorator';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiExcludeEndpoint,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {AuthGuard} from '@nestjs/passport';
import {Request} from 'express';
import { AdminService } from './admin.service';
import { AddUserDto } from './dto/addUser.dto';
import { Roles } from '@/common/decorators/roles.decorator';
import { AdminRole } from './entity/admin.entity';
import { UpdateUserDto } from './dto/updateUser.dto';
import { AddAdminDto } from './dto/addAdmin.dto';
import { UpdateAdminDto } from './dto/updateAdmin.dto';


@ApiTags('Admin')
@ApiBearerAuth()
@Controller('Admin')
export class AdminController {
    constructor(
        private readonly adminService: AdminService,
    ) {
    }

    @ApiCreatedResponse({description: 'Login successful'})
    @ApiUnauthorizedResponse({description: 'Invalid credentials'})
    @Public()
    @Post('login')
    async login(
        @Body() {email, password, token}: { email: string; password: string; token: string }
    ) {
        console.log(email,password,token)
        return await this.adminService.login(email, password,token);
    }


    @ApiCreatedResponse({description: 'Verification code sent'})
    @ApiBadRequestResponse({description: 'User not found'})
    @Public()
    @Post('password/forgot')
    async forgotPassword(
        @Body() {email_or_username}: { email_or_username: string }
    ) {
        return await this.adminService.forgotPassword(email_or_username);
    }

    @ApiCreatedResponse({description: 'Code verified'})
    @ApiBadRequestResponse({description: 'Invalid verification code'})
    @Public()
    @Post('password/verify-code')
    async verifyForgotPasswordCode(
        @Body() {
            email_or_username,
            verification_code
        }: { email_or_username: string; verification_code: string }
    ) {
        return await this.adminService.verifyForgotPasswordCode(email_or_username, verification_code);
    }

    @ApiCreatedResponse({description: 'Password reset successfully'})
    @ApiBadRequestResponse({description: 'Passwords do not match'})
    @Public()
    @Post('password/reset')
    async resetPassword(
        @Body() {password, confirm_password, email_or_username}: { password: string; confirm_password: string; email_or_username: string }
    ) {
        return await this.adminService.resetPassword(password, confirm_password, email_or_username);
    }

    @ApiCreatedResponse({description: 'Check User Authentication'})
    @Public()
    @Post('check')
    @UseGuards(AuthGuard('jwt'))
    async checkAuth(@Req() req: Request) {

        const {appName, packageName, version, buildNumber, token} = req.body;
        const headerToken = req.headers.authorization.split(' ')[1];

        return await this.adminService.checkAuthentication(headerToken, appName, packageName, version, buildNumber, token);
    }

    @ApiCreatedResponse({description: 'Add User By SuperAdmin'})
    @Roles(AdminRole.SUPERADMIN)
    @Post('user/add')
    async addUser(
        @Body() addUserDto: AddUserDto
    ){
        return await this.adminService.addUser(addUserDto);
    }

    @ApiCreatedResponse({description: 'Add Admin By SuperAdmin'})
    @Roles(AdminRole.SUPERADMIN)
    @Post('admin/add')
    async addAdmin(
        @Body() addAdminDto: AddAdminDto
    ){
        return await this.adminService.addAdmin(addAdminDto);
    }

    @ApiCreatedResponse({description: 'Update User By SuperAdmin'})
    @Roles(AdminRole.SUPERADMIN)
    @Patch('user/:id')
    async updateUser(
        @Param('id') id: number, 
        @Body() updateUserDto: UpdateUserDto
    ){
        return await this.adminService.updateUser(id, updateUserDto);
    }

    @ApiCreatedResponse({description: 'Update Admin By SuperAdmin'})
    @Roles(AdminRole.SUPERADMIN)
    @Patch('admin/:id')
    async updateAdmin(
        @Param('id') id: number, 
        @Body() updateAdminDto: UpdateAdminDto
    ){
        return await this.adminService.updateAdmin(id, updateAdminDto);
    }

    @ApiCreatedResponse({description: 'List All Users By SuperAdmin'})
    @Roles(AdminRole.SUPERADMIN)
    @ApiOperation({ summary: 'Get All Users' })
    @Get('user/all')
    async getAllUsers() {
    return this.adminService.getAllUsers();
    }

    @ApiCreatedResponse({description: 'List All Admins By SuperAdmin'})
    @Roles(AdminRole.SUPERADMIN)
    @ApiOperation({ summary: 'Get All Admins' })
    @Get('admin/all')
    async getAllAdmins() {
    return this.adminService.getAllAdmins();
    }


}
