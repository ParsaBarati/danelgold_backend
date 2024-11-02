import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "@/user/user/entity/user.entity";
import { NotificationController } from "./notification.controller";
import { NotificationService } from "./notification.service";
import { Notification } from "./entity/notification.entity";


@Module({
    imports: [TypeOrmModule.forFeature([Notification, User]),],

    controllers: [NotificationController],
    providers: [NotificationService]
})
export class NotificationModule {
}