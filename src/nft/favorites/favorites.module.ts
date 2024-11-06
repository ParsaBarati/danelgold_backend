import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "@/user/user/entity/user.entity";
import {NFT} from "@/nft/nft/entity/nft.entity";
import {FavoritesController} from "@/nft/favorites/favorites.controller";
import {FavoritesService} from "@/nft/favorites/favorites.service";
import {FavoritesEntity} from "@/nft/favorites/entity/favorites.entity";

@Module({
    imports: [TypeOrmModule.forFeature([NFT, User,FavoritesEntity])],

    controllers: [FavoritesController],
    providers: [FavoritesService]
})
export class FavoritesModule {
}
