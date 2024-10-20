import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Message } from "./entity/message.entity";
import { MessageController } from "./message.controller";
import { MessageService } from "./message.service";
import { User } from "@/User/user/entity/user.entity";


@Module({
    imports: [TypeOrmModule.forFeature([Message,User])],
    controllers: [MessageController],
    providers: [MessageService]
})
export class MessageModule{}