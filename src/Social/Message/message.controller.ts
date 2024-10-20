import { Controller, Get, Req } from "@nestjs/common";
import { MessageService } from "./message.service";
import { Request } from "express";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('Message')
@ApiBearerAuth()
@Controller('Message')
export class MessageController{
    constructor(private readonly messageService: MessageService){}

    @ApiOperation({ summary: 'getMessages' })
    @Get()
    async getMessage(
        @Req() req:Request
    ){
        const userIdentifier = (req.user as any).result.phone || (req.user as any).result.email;
        return await this.messageService.getMessage(userIdentifier)
    }
}
