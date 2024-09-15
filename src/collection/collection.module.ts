import { Module } from "@nestjs/common";
import { CollectionsController } from "@/collection/collection.controller";
import { CollectionsService } from "@/collection/collection.service";
import { User } from "@/user/entity/user.entity";
import { PaginationService } from "@/common/paginate/pagitnate.service";
import { CollectionEntity } from "./entity/collection.entity";
import { TypeOrmModule } from "@nestjs/typeorm";


@Module({
    imports:[TypeOrmModule.forFeature([CollectionEntity,User])],
    controllers:[CollectionsController],
    providers:[CollectionsService,PaginationService]
})
export class CollectionEntityModule{}