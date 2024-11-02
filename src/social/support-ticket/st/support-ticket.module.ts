import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SupportTicket } from "@/social/support-ticket/st/entity/support-ticket.entity";
import { User } from "@/user/user/entity/user.entity";
import { SupportTicketsController } from "./support-ticket.controller";
import { SupportTicketsService } from "./support-ticket.service";


@Module({
    imports:[TypeOrmModule.forFeature([SupportTicket,User])],
    controllers:[SupportTicketsController],
    providers:[SupportTicketsService]
})
export class SupportTicketModule{}