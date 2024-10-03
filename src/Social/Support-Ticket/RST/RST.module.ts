import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RST } from "./entity/RST.entity";
import { SupportTicket } from "../ST/entity/support-ticket.entity";
import { RSTController } from "./RST.controller";
import { RSTService } from "./RST.service";


@Module({
    imports: [TypeOrmModule.forFeature([RST,SupportTicket])],
    controllers: [RSTController],
    providers:[RSTService]
})
export class RSTModule{}