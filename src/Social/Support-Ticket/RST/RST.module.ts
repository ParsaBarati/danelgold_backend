import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RST } from "@/social/support-ticket/rst/entity/rst.entity";
import { SupportTicket } from "../st/entity/support-ticket.entity";
import { RSTController } from "./rst.controller";
import { RSTService } from "./rst.service";


@Module({
    imports: [TypeOrmModule.forFeature([RST,SupportTicket])],
    controllers: [RSTController],
    providers:[RSTService]
})
export class RSTModule{}