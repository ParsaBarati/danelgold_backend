import { Module } from "@nestjs/common";
import { User } from "@/User/user/entity/user.entity";
import { Auction } from "@/Market/auction/entity/auction.entity";
import { AuctionsController } from "@/Market/auction/auction.controller";
import { AuctionsService } from "@/Market/auction/auction.service";
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