import { Controller, Get, Param } from "@nestjs/common";
import { NotificationService } from "./notification.service";


@Controller('notification')
export class NotificationController{
    constructor(
        private readonly notificationService: NotificationService
    ){}

    @Get(':/userPhone')
    async getNotifications(
        @Param() userPhone: string
    ){
        return await this.notificationService.getNotifications(userPhone)
    }

}