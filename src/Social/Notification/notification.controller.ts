import {Controller, Get, Param, Req, UseGuards} from "@nestjs/common";
import {NotificationService} from "./notification.service";
import {ApiBearerAuth, ApiOperation, ApiTags} from "@nestjs/swagger";
import { Request } from 'express';
import {User} from "@/User/user/entity/user.entity";
import {AuthGuard} from "@nestjs/passport";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@ApiTags('Notification')
@ApiBearerAuth()
@Controller('notification')
export class NotificationController {
    constructor(
        private readonly notificationService: NotificationService
    ) {
    }

    @ApiOperation({summary: 'GetNotifications'})
    @Get('/')

    async getNotifications(
        @Req() req: Request
    ) {
        return await this.notificationService.getNotifications(req.user as any)
    }


    @ApiOperation({summary: 'SendNotif'})
    @Get('send')
    @UseGuards(AuthGuard('jwt'))

    async sendNotification(
        @Req() req: Request
    ) {
        return await this.notificationService.sendPushNotification((req.user as any),"Test","Sample data","Sample body")
    }


}