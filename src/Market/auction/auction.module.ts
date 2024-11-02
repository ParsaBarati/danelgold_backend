import { Module } from "@nestjs/common";
import { User } from "@/user/user/entity/user.entity";
import { Auction } from "@/market/auction/entity/auction.entity";
import { AuctionsController } from "@/market/auction/auction.controller";
import { AuctionsService } from "@/market/auction/auction.service";
import { Bid } from "./entity/auctionBid.entity";
import { PaginationService } from "@/common/paginate/pagitnate.service";
import { SmsService } from "@/services/sms.service";
import { TypeOrmModule } from "@nestjs/typeorm";


@Module({
    imports:[TypeOrmModule.forFeature([Auction,Bid,User])],
    controllers:[AuctionsController],
    providers:[AuctionsService,PaginationService,SmsService]
})
export class AuctionModule{}