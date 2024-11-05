import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import {NFT} from "../nft/nft/entity/nft.entity";
import {CollectionEntity} from "../market/collection/entity/collection.entity";

@Module({
    imports: [TypeOrmModule.forFeature([NFT, CollectionEntity])],
    providers: [SeederService],
    exports: [SeederService],
})
export class SeederModule {}
