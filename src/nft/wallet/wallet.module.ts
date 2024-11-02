import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CryptoBalanceEntity} from "@/nft/crypto/entity/cryptoBalance.entity";
import { NFT } from "../nft/entity/nft.entity";
import { WalletService } from "./wallet.service";
import { WalletController } from "./wallet.controller";
import { Wallet } from "./entity/wallet.entity";
import { CryptoEntity } from "../crypto/entity/crypto.entity";


@Module({
    imports: [TypeOrmModule.forFeature([Wallet, CryptoEntity, NFT, CryptoBalanceEntity])],
    controllers: [WalletController],
    providers: [WalletService]
})
export class WalletModule {
}