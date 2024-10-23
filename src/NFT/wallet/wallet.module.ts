import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Wallet} from "./entity/wallet.entity";
import {WalletController} from "./wallet.controller";
import {WalletService} from "./wallet.service";
import {NFT} from "../nft/entity/nft.entity";
import {CryptoEntity} from "../Crypto/entity/crypto.entity";
import {CryptoBalanceEntity} from "@/NFT/Crypto/entity/cryptoBalance.entity";


@Module({
    imports: [TypeOrmModule.forFeature([Wallet, CryptoEntity, NFT, CryptoBalanceEntity])],
    controllers: [WalletController],
    providers: [WalletService]
})
export class WalletModule {
}