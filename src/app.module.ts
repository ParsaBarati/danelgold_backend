import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { User } from '@/user/entity/user.entity';
import { CollectionEntity } from '@/collection/entity/collection.entity';
import { NFT } from '@/nft/entity/nft.entity';
import { Auction } from '@/auction/entity/auction.entity';
import { UserModule } from '@/user/user.module';
import { AuctionModule } from './auction/auction.module';
import { NFTModule } from './nft/nft.module';
import { CollectionEntityModule } from './collection/collection.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'nft-marketplace.sqlite',
      entities: [User, CollectionEntity, NFT, Auction],
      synchronize: true, 
    }),
    TypeOrmModule.forFeature([User, CollectionEntity, NFT, Auction]),
    UserModule,
    AuthModule,
    CollectionEntityModule,
    NFTModule,
    AuctionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
