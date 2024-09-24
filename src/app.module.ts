import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import typeormDataSource from './config/data-source';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { OtpModule } from './auth/otp/otp.module';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { JwtStrategy } from './auth/strategy/jwt.strategy';
import { TokenModule } from './auth/token/token.module';
import { UserModule } from './user/user.module';
import { SessionModule } from './session/session.module';
import { SubscribeModule } from './subscribe/subscribe.module';
import { UserDetailModule } from './user-detail/userDetail.module';
import { PaymentModule } from './payment/payment.module';
import { UploadModule } from './upload/upload.module';
import { WalletModule } from './wallet/wallet.module';
import { walletTransaction } from './wallet/entity/walletTransaction.entity';
import { LoggingInterceptor } from './common/utils/logger.interseptor';
import { AllExceptionsFilter } from './common/exeptionFilters/global.error';
import { UserAgentMiddleware } from './common/middleware/user-agent.middleware';
import { AuctionModule } from './auction/auction.module';
import { CollectionEntityModule } from './collection/collection.module';
import { NFTModule } from './nft/nft.module';
import { ForumModule } from './forum/forum.module';
import { SupportTicketModule } from './support-ticket/support-ticket.module';
import { TransactionModule } from './transaction/transaction.module';
import { UserService } from './user/user.service';
import { User } from './user/entity/user.entity';
import { Token } from './auth/token/entity/token.entity';
import { SmsService } from './services/sms.service';
import { IPFSService } from './services/IPFS.service';
import { PinataModule } from './pinta/pinta.module';
import { StoriesModule } from './stories/stories.module';
import { PostsModule } from './posts/posts.module';
import { PostsController } from './posts/posts.controller';
import { LikePostModule } from './Social/Post/like-post/like-post.module';
import { LikePostModule } from './src/social/like-post/like-post.module';
import { PostsController } from './posts/posts.controller';


@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 50,
      },
    ]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
    ConfigModule.forRoot({
      envFilePath: '.develop.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => {
        const synchronize = configService.get('NODE_ENV') === 'development';

        console.log('synchronize ' + synchronize);
        return {
          ...typeormDataSource.options,
          autoLoadEntities: true,
        };
      },
    }),
    TypeOrmModule.forFeature([
      User,
      Token
    ]),
    AuctionModule,
    CollectionEntityModule,
    NFTModule,
    ForumModule,
    SupportTicketModule,
    WalletModule,
    walletTransaction,
    TransactionModule,
    AuthModule,
    UserModule,
    UserDetailModule,
    OtpModule,
    SessionModule,
    UploadModule,
    SubscribeModule,
    PaymentModule,
    TokenModule,
    PinataModule,
    StoriesModule,
    PostsModule,
    LikePostModule
  ],
  controllers: [AppController, PostsController],
  providers: [
    AppService,
    UserService,
    IPFSService,
    SmsService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
  exports:[IPFSService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAgentMiddleware).forRoutes('*');
  }
}
