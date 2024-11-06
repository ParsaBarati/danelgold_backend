import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {APP_FILTER, APP_GUARD, APP_INTERCEPTOR} from '@nestjs/core';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ThrottlerModule} from '@nestjs/throttler';
import {ServeStaticModule} from '@nestjs/serve-static';
import typeormDataSource from '@/config/data-source';
import {join} from 'path';
import {AppController} from '@/app.controller';
import {AppService} from '@/app.service';
import {AuthModule} from '@/user/auth/auth.module';
import {UserModule} from '@/user/user/user.module';
import {SessionModule} from '@/session/session.module';
import {SubscribeModule} from '@/user/subscribe/subscribe.module';
import {UserDetailModule} from '@/user/user-detail/userDetail.module';
import {UploadModule} from '@/upload/upload.module';
import {LoggingInterceptor} from '@/common/utils/logger.interseptor';
import {AllExceptionsFilter} from '@/common/exeptionFilters/global.error';
import {UserAgentMiddleware} from '@/common/middleware/user-agent.middleware';
import {AuctionModule} from '@/market/auction/auction.module';
import {CollectionEntityModule} from '@/market/collection/collection.module';
import {NFTModule} from '@/nft/nft/nft.module';
import {ForumModule} from '@/social/forum/forum.module';
import {SupportTicketModule} from '@/social/support-ticket/st/support-ticket.module';
import {UserService} from '@/user/user/user.service';
import {User} from '@/user/user/entity/user.entity';
import {SmsService} from '@/services/sms.service';
import {IPFSService} from '@/services/IPFS.service';
import {PinataModule} from '@/nft/pinta/pinta.module';
import {StoriesModule} from '@/social/story/stories/stories.module';
import {PostsModule} from '@/social/post/posts/posts.module';
import {Story} from '@/social/story/stories/entity/stories.entity';
import {Comment} from '@/social/comment/comment/entity/comment.entity';
import {Reply} from '@/social/comment/replyComment/entity/reply.entity';
import {likeComment} from '@/social/comment/like-comment/entity/like-comment.entity';
import {Post} from '@/social/post/posts/entity/posts.entity';
import {likePost} from '@/social/post/like-post/entity/like-post.entity';
import {likeStory} from '@/social/story/like-story/entity/like-story.entity';
import {Club} from '@/social/club/entity/club.entity';
import {NotificationModule} from '@/social/notification/notification.module';
import {WalletModule} from '@/nft/wallet/wallet.module';
import {CryptoEntity} from '@/nft/crypto/entity/crypto.entity';
import {FollowUser} from '@/social/follow/entity/follow.entity';
import {LikePostModule} from "@/social/post/like-post/like-post.module";
import {SavePostModule} from "@/social/post/save-post/save-post.module";
import {savePost} from "@/social/post/save-post/entity/save-post.entity";
import {LikeStoryModule} from "@/social/story/like-story/like-story.module";
import { Notification } from '@/social/notification/entity/notification.entity';
import { NotificationService } from '@/social/notification/notification.service';
import { HttpModule } from '@nestjs/axios';
import { MessageModule } from '@/social/message/message/message.module';
import { LikeMessageModule } from '@/social/message/like-message/like-message.module';
import { BlockUser } from '@/social/block/entity/block.entity';
import { Admin } from '@/user/admin/entity/admin.entity';
import { AdminModule } from '@/user/admin/admin.module';
import {DashboardModule} from "./user/dashboard/dashboard.module";
import { OtpModule } from '@/user/auth/otp/otp.module';
import { TokenModule } from '@/user/auth/token/token.module';
import { RSTModule } from '@/social/support-ticket/rst/rst.module';
import { JwtStrategy } from '@/user/auth/strategy/jwt.strategy';
import { JwtAuthGuard } from '@/user/auth/guards/jwt.guard';
import { RolesGuard } from '@/user/auth/guards/roles.guard';
import { Token } from '@/user/auth/token/entity/token.entity';
import { PriceModule } from './market/price/price.module';
import { MarketPlaceModule } from './market/market-place/marketplace.module';
import { BlogPostModule } from './social/blog/blog-post/blog-post.module';
import { BlogCategory } from './social/blog/blog-catagory/entity/blog-catagory.entity';
import {SeederModule} from "@/database/seeder.module";
import { SliderModule } from './market/slider/slider.module';
import {NFT} from "@/nft/nft/entity/nft.entity";



@Module({
    imports: [
        SeederModule,
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
            envFilePath: '.env',
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],

            useFactory: (configService: ConfigService) => {
                const synchronize = configService.get('NODE_ENV') === 'development';

                console.log('synchronize ' + synchronize);
                console.log(typeormDataSource.options);


                return {
                    ...typeormDataSource.options,
                    autoLoadEntities: true,
                    connectTimeoutMS: 30000,
                };
            },
        }),
        TypeOrmModule.forFeature([
            User,
            Admin,
            Token,
            Club,
            Story,
            Comment,
            likeComment,
            Reply,
            Post,
            likePost,
            likeStory,
            CryptoEntity,
            FollowUser,
            BlockUser,
            savePost,
            Notification,
            BlogCategory,
            NFT
        ]),
        AuctionModule,
        CollectionEntityModule,
        NFTModule,
        ForumModule,
        SupportTicketModule,
        AuthModule,
        AdminModule,
        UserModule,
        UserDetailModule,
        OtpModule,
        SessionModule,
        UploadModule,
        SubscribeModule,
        TokenModule,
        PinataModule,
        StoriesModule,
        PostsModule,
        LikePostModule,
        LikeStoryModule,
        SavePostModule,
        RSTModule,
        MessageModule,
        LikeMessageModule,
        NotificationModule,
        WalletModule,
        DashboardModule,
        PriceModule,
        MarketPlaceModule,
        BlogPostModule,
        SliderModule,
        {
            global: true,
            ...HttpModule.register({maxRedirects: 5}),
        }

    ],
    controllers: [AppController,],
    providers: [
        AppService,
        UserService,
        IPFSService,
        SmsService,
        JwtStrategy,
        NotificationService,
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
    exports: [IPFSService, HttpModule]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(UserAgentMiddleware).forRoutes('*');
    }
}
