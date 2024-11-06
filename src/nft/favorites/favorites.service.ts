import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {User} from '@/user/user/entity/user.entity';
import {FavoritesEntity} from "./entity/favorites.entity";
import {NFT} from "../nft/entity/nft.entity";

@Injectable()
export class FavoritesService {
    constructor(
        @InjectRepository(NFT)
        private readonly nftRepository: Repository<NFT>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(FavoritesEntity)
        private readonly favoritesEntityRepository: Repository<FavoritesEntity>,
    ) {
    }

    async saveNFT(
        nftId: number,
        user: User,
    ): Promise<{ favorites: number }> {

        const savebleNFT = await this.nftRepository.findOneBy(
            {id: nftId}
        );

        if (!savebleNFT) {
            throw new NotFoundException('NFT not found!');
        }


        if (!user) {
            throw new NotFoundException('User not found');
        }

        let existingSave = await this.favoritesEntityRepository.findOne({
            where: {nft: {id: nftId}, user: {id: user.id}},
        });
        console.log(existingSave)

        if (!existingSave) {
            console.log(nftId, user)
            const save = await this.favoritesEntityRepository.create({
                nftId: nftId,
                userId: user.id,
            });
            console.log(save)
            await this.favoritesEntityRepository.save(save);

            savebleNFT.favorites++;
        } else {
            await this.favoritesEntityRepository.remove(existingSave);
            savebleNFT.favorites--;
        }

        try {
            await this.nftRepository.save(savebleNFT);
        } catch (e) {
            console.info(e)
        }

        return {favorites: savebleNFT.favorites};
    }

    async getSavedNFTs(user: User): Promise<any[]> {
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Preload the saved nfts with related user and nft data, along with likes and favorites
        const savedNFTs = await this.favoritesEntityRepository.find({
            where: {user: {id: user.id}},
            relations: ['nft', 'nft.user', 'nft.nftFavorites'],
        });

        return savedNFTs.map(savedNFT => {
            const nft = savedNFT.nft;

        });
    }

}
