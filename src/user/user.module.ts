import { Module } from "@nestjs/common";
import { User } from "./entity/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { Token } from "@/auth/token/entity/token.entity";
import { SmsService } from "@/services/sms.service";
import { TypeOrmModule } from "@nestjs/typeorm";



@Module({
    imports:[TypeOrmModule.forFeature([User,Token])],
    controllers:[UserController],
    providers:[UserService,SmsService]
})
export class UserModule{}