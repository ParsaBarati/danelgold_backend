import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@/user/user/entity/user.entity";
import { NFT } from "@/nft/nft/entity/nft.entity";
import { NFTsController } from "@/nft/nft/nft.controller";
import { NFTsService } from "@/nft/nft/nft.service";
import { IPFSService } from "@/services/IPFS.service";


@Module({
    imports:[TypeOrmModule.forFeature([NFT,User])],
    controllers:[NFTsController],
    providers:[NFTsService,IPFSService]
})
export class NFTModule{}