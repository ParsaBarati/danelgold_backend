import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entity/wallet.entity';
import { NFT } from '@/NFT/nft/entity/nft.entity';
import { CryptoEntity } from '../Crypto/entity/crypto.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(CryptoEntity)
    private readonly cryptoRepository: Repository<CryptoEntity>,
    @InjectRepository(NFT)
    private readonly nftRepository: Repository<NFT>,
  ) {}

  async getWallet(userPhone: number): Promise<any> {

    const wallets = await this.walletRepository
      .createQueryBuilder('wallet')
      .leftJoinAndSelect('wallet.user', 'user')
      .where('wallet.userPhone = :userPhone', { userPhone })
      .getMany();

    const cryptos = await this.cryptoRepository
      .createQueryBuilder('cryptos')
      .leftJoinAndSelect('cryptos.user', 'user')
      .where('crypto.userPhone = :userPhone', { userPhone })
      .getMany();

    const nfts = await this.nftRepository
      .createQueryBuilder('nft')
      .leftJoinAndSelect('nft.owner', 'owner')
      .leftJoinAndSelect('nft.creator', 'creator')
      .where('nft.ownerPhone = :userPhone', { userPhone })
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
        name: `${nft.creator.userName} ${nft.creator.userName}`,
        username: nft.creator.userName,
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
