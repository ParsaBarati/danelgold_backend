import { Module } from "@nestjs/common";
import { NFT } from "@/nft/entity/nft.entity";
import { NFTsController } from "@/nft/nft.controller";
import { NFTsService } from "@/nft/nft.service";


@Module({
    imports:[NFT],
    controllers:[NFTsController],
    providers:[NFTsService]
})
export class NFTModule{}