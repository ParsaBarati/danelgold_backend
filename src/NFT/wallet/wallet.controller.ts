import { Controller, Get, Req } from "@nestjs/common";
import { WalletService } from "./wallet.service";
import { Request } from "express";


@Controller('wallet')
export class WalletController{
    constructor( private readonly walletService: WalletService){}

    @Get('')
    async getWallet(
        @Req() req:Request
    ){
        const userPhone = (req.user as any).result.phone;
        return await this.walletService.getWallet(userPhone)
    }
}