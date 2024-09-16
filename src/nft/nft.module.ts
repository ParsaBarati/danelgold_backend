import { Module } from "@nestjs/common";
import { NFT } from "@/nft/entity/nft.entity";
import { NFTsController } from "@/nft/nft.controller";
import { NFTsService } from "@/nft/nft.service";
import { User } from "@/user/entity/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IPFSService } from "@/services/IPFS.service";


@Module({
    imports:[TypeOrmModule.forFeature([NFT,User])],
    controllers:[NFTsController],
    providers:[NFTsService,IPFSService]
})
export class NFTModule{}