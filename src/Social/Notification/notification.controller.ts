import {Body, Controller, Get, Param, Post, Req, UseGuards} from "@nestjs/common";
import {NotificationService} from "./notification.service";
import {ApiBearerAuth, ApiOperation, ApiTags} from "@nestjs/swagger";
import { Request } from 'express';
import {AuthGuard} from "@nestjs/passport";
import { NotificationAction } from "./entity/notification.entity";

@ApiTags('Notification')
@ApiBearerAuth()
@Controller('notification')
export class NotificationController {
    constructor(
        private readonly notificationService: NotificationService
    ) {}

    @ApiOperation({ summary: 'Send Notification' })
    @Post('send')
    async sendNotification(
    @Body('recipientId') recipientId: number,
    @Body('action') action: NotificationAction,
    @Body('title') title: string,
    @Body('thumb') thumb: string,
    @Body('senderId') senderId?: number, // senderId is optional
  ) {
    return this.notificationService.sendNotification(
      recipientId,
      action,
      title,
      thumb,
      senderId,
    );
  }

    @ApiOperation({summary: 'Get Notifications For User'})
    @Get('/')

    async getNotifications(
        @Req() req: Request
    ) {
        return await this.notificationService.getNotifications(req.user as any)
    }

    @ApiOperation({ summary: 'Send Push Notification' })
    @Get('send')
    @UseGuards(AuthGuard('jwt'))

    async sendPushNotification(
        @Req() req: Request
    ) {
        return await this.notificationService.sendPushNotification(
            (req.user as any),
            "Test",
            "Sample data",
            "Sample body"
        );
    }


}