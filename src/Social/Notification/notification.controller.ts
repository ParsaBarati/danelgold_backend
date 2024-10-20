import { Controller, Get, Param } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('Notification')
@ApiBearerAuth()
@Controller('notification')
export class NotificationController{
    constructor(
        private readonly notificationService: NotificationService
    ){}

    @ApiOperation({summary:'GetNotifications'})
    @Get(':/userIdentifier')
    async getNotifications(
        @Param() userIdentifier: string
    ){
        return await this.notificationService.getNotifications(userIdentifier)
    }

}