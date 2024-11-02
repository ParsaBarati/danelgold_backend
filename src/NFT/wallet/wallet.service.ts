import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {NFT} from '@/nft/nft/entity/nft.entity';
import {User} from "@/user/user/entity/user.entity";
import {CryptoBalanceEntity} from "@/nft/crypto/entity/cryptoBalance.entity";
import { Wallet } from '@/nft/wallet/entity/wallet.entity';
import { CryptoEntity } from '@/nft/crypto/entity/crypto.entity';

@Injectable()
export class WalletService {
    constructor(
        @InjectRepository(Wallet)
        private readonly walletRepository: Repository<Wallet>,
        @InjectRepository(CryptoEntity)
        private readonly cryptoRepository: Repository<CryptoEntity>,
        @InjectRepository(CryptoBalanceEntity)
        private readonly cryptoBalanceEntityRepository: Repository<CryptoBalanceEntity>,
        @InjectRepository(NFT)
        private readonly nftRepository: Repository<NFT>,
    ) {
    }

    async getWallet(
        user: User
    ): Promise<any> {

        const userId = user.id;
        const wallets = await this.walletRepository
            .createQueryBuilder('wallet')
            .leftJoinAndSelect('wallet.user', 'user')
            .where('wallet.userId = :userId', {userId})
            .getMany();

        const cryptos = await this.cryptoRepository
            .createQueryBuilder('crypto')
            .leftJoinAndSelect('crypto.balances', 'balances')
            .leftJoinAndSelect('balances.user', 'user')
            .where('user.id = :userId', { userId })
            .orWhere('balances.id IS NULL')
            .select([
                'crypto.id AS id',             // Select crypto.id
                'crypto.logo AS logo',         // Select crypto.logo
                'crypto.name AS name',         // Select crypto.name
                'crypto.price AS price',       // Select crypto.price
                'COALESCE(balances.balance, 0) AS balance'  // Select balance with default 0
            ])
            .getRawMany();  // Use getRawMany() to get raw results




        const nfts = await this.nftRepository
            .createQueryBuilder('nft')
            .leftJoinAndSelect('nft.owner', 'owner')
            .leftJoinAndSelect('nft.creator', 'creator')
            .where('nft.ownerId = :userId', {userId})
            .getMany();

        const transformedWallets = wallets.map((wallet) => ({
            id: wallet.id,
            name: wallet.name,
            balance: wallet.balance,
            isSelected: wallet.isSelected,
        }));


        const transformedCryptos = cryptos.map((crypto) => ({
            id: crypto.id,
            logo: crypto.logo,
            name: crypto.name,
            balance: crypto.balance,
            price: crypto.price,
        }));

        const transformedNFTs = nfts.map((nft) => ({
            id: nft.id,
            name: nft.name,
            imgUrl: nft.image,
            creator: {
                id: nft.creator.id,
                name: `${nft.creator.name}`,
                username: nft.creator.username,
                pic: nft.creator.profilePic,
            },
        }));

        return {
            wallets: transformedWallets,
            crypto: transformedCryptos,
            nft: transformedNFTs,
        };
    }
}
