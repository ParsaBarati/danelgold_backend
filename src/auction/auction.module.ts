import { Module } from "@nestjs/common";
import { Auction } from "@/auction/entity/auction.entity";
import { AuctionsController } from "@/auction/auction.controller";
import { AuctionsService } from "@/auction/auction.service";
import { Bid } from "./entity/auctionBid.entity";
import { User } from "@/user/entity/user.entity";
import { PaginationService } from "@/common/paginate/pagitnate.service";
import { SmsService } from "@/services/sms.service";
import { TypeOrmModule } from "@nestjs/typeorm";


@Module({
    imports:[TypeOrmModule.forFeature([Auction,Bid,User])],
    controllers:[AuctionsController],
    providers:[AuctionsService,PaginationService,SmsService]
})
export class AuctionModule{}