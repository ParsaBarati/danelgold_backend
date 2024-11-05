import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {PriceEntity} from "./entity/price.entity";
import {NFT} from "@/nft/nft/entity/nft.entity";
import {PriceController} from "./price.controller";
import {PricesService} from "./price.service";
import {CollectionEntity} from "../collection/entity/collection.entity";
import {PaginationService} from "@/common/paginate/pagitnate.service";
import {User} from "@/user/user/entity/user.entity";


@Module({
    imports: [TypeOrmModule.forFeature([PriceEntity, NFT, CollectionEntity, User])],
    controllers: [PriceController],
    providers: [PricesService, PaginationService]
})
export class PriceModule {
}