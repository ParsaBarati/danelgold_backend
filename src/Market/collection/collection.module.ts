import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@/User/user/entity/user.entity";
import { NFT } from "@/NFT/nft/entity/nft.entity";
import { CollectionsController } from "@/Market/collection/collection.controller";
import { CollectionsService } from "@/Market/collection/collection.service";
import { CollectionEntity } from "./entity/collection.entity";
import { PaginationService } from "@/common/paginate/pagitnate.service";


@Module({
    imports:[TypeOrmModule.forFeature([CollectionEntity,User,NFT])],
    controllers:[CollectionsController],
    providers:[CollectionsService,PaginationService]
})
export class CollectionEntityModule{}