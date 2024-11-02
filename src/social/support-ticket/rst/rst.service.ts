import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ApiResponses, createResponse } from "@/utils/response.util";
import { RST } from "@/social/support-ticket/rst/entity/rst.entity";
import { SupportTicket, TicketStatus } from "@/social/support-ticket/st/entity/support-ticket.entity";


@Injectable()
export class RSTService{
    constructor(
        @InjectRepository(RST)
        private rstRepository: Repository<RST>,
        @InjectRepository(SupportTicket)
        private ticketRepository: Repository<SupportTicket>
    ){}

    async RST(
        stId: number,
        content: string
    ):Promise<ApiResponses<RST>>{

        const ST = await this.ticketRepository.findOne({
            where: { 
                id: stId,
                status: TicketStatus.OPEN
            }
        })

        if(!ST){
            throw new NotFoundException('تیکت یافت نشد و یا در حالت باز قرار ندارد')
        }

        if (ST.status !== TicketStatus.IN_PROGRESS) {
            ST.status = TicketStatus.IN_PROGRESS;
            await this.ticketRepository.save(ST); 
          }

        const rst = {
            content,
            parentSTId: stId,
            createdAt: new Date()
        }

        const savedRST = await this.rstRepository.save(rst);

        return createResponse (201,savedRST)
    }

    async URST(
        rstId: number,
        content?: string
    ):Promise<ApiResponses<RST>>{

        const rst = await this.rstRepository.findOneBy({ id: rstId });

        if(!rst){
            throw new NotFoundException('پاسخ تیکت یافت نشد')
        }

        if (content) {
            rst.content = content;
        }

        rst.updatedAt = new Date()

        const updatedRST = await this.rstRepository.save(rst);

        return createResponse(200,updatedRST);
    }
}