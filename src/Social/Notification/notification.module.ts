import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Notification} from "./entity/notification.entity";
import {NotificationController} from "./notification.controller";
import {NotificationService} from "./notification.service";
import {HttpModule} from "@nestjs/axios";
import {User} from "@/User/user/entity/user.entity";


@Module({
    imports: [TypeOrmModule.forFeature([Notification, User]), HttpModule,],

    controllers: [NotificationController],
    providers: [NotificationService]
})
export class NotificationModule {
}