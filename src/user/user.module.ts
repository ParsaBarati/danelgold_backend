import { Module } from "@nestjs/common";
import { User } from "./entity/user.entity";
import { UsersController } from "./user.controller";
import { UserService } from "./user.service";



@Module({
    imports:[User],
    controllers:[UsersController],
    providers:[UserService]
})
export class UserModule{}