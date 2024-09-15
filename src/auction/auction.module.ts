import { Module } from "@nestjs/common";
import { Auction } from "@/auction/entity/auction.entity";
import { AuctionsController } from "@/auction/auction.controller";
import { AuctionsService } from "@/auction/auction.service";


@Module({
    imports:[Auction],
    controllers:[AuctionsController],
    providers:[AuctionsService]
})
export class AuctionModule{}