import { Body, Controller, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { RSTService } from "./RST.service";


@Controller('RST')
export class RSTController{
    constructor(private readonly rstService: RSTService){}

    @Post()
    async RST(
        @Param('stId',ParseIntPipe) stId: number,
        @Body() content: string
    ){
        return await this.rstService.RST(stId,content)
    }

    @Put()
    async URST(
        @Param('rstId',ParseIntPipe) rstId: number,
        @Body() content?: string
    ){
        return await this.rstService.URST(rstId,content)
    }
}