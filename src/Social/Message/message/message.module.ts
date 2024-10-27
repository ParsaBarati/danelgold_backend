import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Message} from "./entity/message.entity";
import {MessageController} from "./message.controller";
import {MessageService} from "./message.service";
import {User} from "@/User/user/entity/user.entity";
import {NotificationService} from "@/Social/Notification/notification.service";
import {Notification} from "@/Social/Notification/entity/notification.entity";
import {HttpModule} from "@nestjs/axios";


@Module({
    imports: [TypeOrmModule.forFeature([Message, User, Notification]),HttpModule],
    controllers: [MessageController],
    providers: [MessageService, NotificationService]
})
export class MessageModule {
}