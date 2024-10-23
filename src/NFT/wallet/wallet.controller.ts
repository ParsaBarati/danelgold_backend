import { Controller, Get, Req } from "@nestjs/common";
import { WalletService } from "./wallet.service";
import { Request } from "express";
import { ApiExcludeController, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('Wallet')
@Controller('wallet')
export class WalletController{
    constructor( private readonly walletService: WalletService){}

    @ApiOperation({ summary: 'GetWallet' })
    @Get()
    async getWallet(
        @Req() req:Request
    ){
        return await this.walletService.getWallet(req.user as any)
    }
}