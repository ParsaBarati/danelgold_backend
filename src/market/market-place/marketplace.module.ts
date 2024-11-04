import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MarketplaceEntity } from "./entity/market-place.entity";
import { MarketplaceController } from "./marketplace.controller";
import { MarketplaceService } from "./marketplace.service";
import { PaginationService } from "@/common/paginate/pagitnate.service";



@Module({
    imports: [TypeOrmModule.forFeature([MarketplaceEntity])],
    controllers: [MarketplaceController],
    providers: [MarketplaceService,PaginationService]
})
export class MarketPlaceModule{}