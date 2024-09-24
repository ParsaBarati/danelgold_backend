import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SupportTicket } from "./entity/support-ticket.entity";
import { SupportTicketsController } from "./support-ticket.controller";
import { SupportTicketsService } from "./support-ticket.service";


@Module({
    imports:[TypeOrmModule.forFeature([SupportTicket])],
    controllers:[SupportTicketsController],
    providers:[SupportTicketsService]
})
export class SupportTicketModule{}