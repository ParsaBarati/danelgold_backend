import { Module } from "@nestjs/common";
import { CollectionEntity } from "@/collection/entity/collection.entity";
import { CollectionsController } from "@/collection/collection.controller";
import { CollectionsService } from "@/collection/collection.service";


@Module({
    imports:[CollectionEntity],
    controllers:[CollectionsController],
    providers:[CollectionsService]
})
export class CollectionEntityModule{}