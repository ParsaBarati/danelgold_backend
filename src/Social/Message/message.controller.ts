import { Controller, Get, Req } from "@nestjs/common";
import { MessageService } from "./message.service";
import { Request } from "express";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags('Message')
@ApiBearerAuth()
@Controller('Message')
export class MessageController{
    constructor(private readonly messageService: MessageService){}

    @Get('message')
    async getMessage(
        @Req() req:Request
    ){
        const userPhone = (req.user as any).result.phone;
        return await this.messageService.getMessage(userPhone)
    }
}
