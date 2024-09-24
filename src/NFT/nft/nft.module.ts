import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@/User/user/entity/user.entity";
import { NFT } from "@/NFT/nft/entity/nft.entity";
import { NFTsController } from "@/NFT/nft/nft.controller";
import { NFTsService } from "@/NFT/nft/nft.service";
import { IPFSService } from "@/services/IPFS.service";


@Module({
    imports:[TypeOrmModule.forFeature([NFT,User])],
    controllers:[NFTsController],
    providers:[NFTsService,IPFSService]
})
export class NFTModule{}