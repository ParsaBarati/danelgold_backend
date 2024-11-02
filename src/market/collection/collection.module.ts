import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@/user/user/entity/user.entity";
import { NFT } from "@/nft/nft/entity/nft.entity";
import { CollectionsController } from "@/market/collection/collection.controller";
import { CollectionsService } from "@/market/collection/collection.service";
import { PaginationService } from "@/common/paginate/pagitnate.service";
import { CollectionEntity } from "./entity/collection.entity";


@Module({
    imports:[TypeOrmModule.forFeature([CollectionEntity,User,NFT])],
    controllers:[CollectionsController],
    providers:[CollectionsService,PaginationService]
})
export class CollectionEntityModule{}