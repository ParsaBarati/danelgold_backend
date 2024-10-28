import {Controller, Get, Req, UseGuards} from "@nestjs/common";
import { WalletService } from "./wallet.service";
import { Request } from "express";
import {ApiBearerAuth, ApiExcludeController, ApiOperation, ApiTags} from "@nestjs/swagger";
import {AuthGuard} from "@nestjs/passport";

@ApiTags('Wallet')
@ApiBearerAuth()
@Controller('wallet')
export class WalletController{
    constructor( private readonly walletService: WalletService){}

    @ApiOperation({ summary: 'Get User Wallet' })
    @UseGuards(AuthGuard('jwt'))
    @Get()
    async getWallet(
        @Req() req:Request
    ){
        return await this.walletService.getWallet(req.user as any)
    }
}