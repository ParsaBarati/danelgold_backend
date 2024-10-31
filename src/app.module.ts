import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {APP_FILTER, APP_GUARD, APP_INTERCEPTOR} from '@nestjs/core';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ThrottlerModule} from '@nestjs/throttler';
import {ServeStaticModule} from '@nestjs/serve-static';
import typeormDataSource from './config/data-source';
import {join} from 'path';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {AuthModule} from './User/auth/auth.module';
import {OtpModule} from './User/auth/otp/otp.module';
import {JwtAuthGuard} from './User/auth/guards/jwt.guard';
import {RolesGuard} from './User/auth/guards/roles.guard';
import {JwtStrategy} from './User/auth/strategy/jwt.strategy';
import {TokenModule} from './User/auth/token/token.module';
import {UserModule} from './User/user/user.module';
import {SessionModule} from './session/session.module';
import {SubscribeModule} from './User/subscribe/subscribe.module';
import {UserDetailModule} from './User/user-detail/userDetail.module';
import {UploadModule} from './upload/upload.module';
import {LoggingInterceptor} from './common/utils/logger.interseptor';
import {AllExceptionsFilter} from './common/exeptionFilters/global.error';
import {UserAgentMiddleware} from './common/middleware/user-agent.middleware';
import {AuctionModule} from './Market/auction/auction.module';
import {CollectionEntityModule} from './Market/collection/collection.module';
import {NFTModule} from './NFT/nft/nft.module';
import {ForumModule} from './Social/forum/forum.module';
import {SupportTicketModule} from './Social/Support-Ticket/ST/support-ticket.module';
import {UserService} from './User/user/user.service';
import {User} from './User/user/entity/user.entity';
import {Token} from './User/auth/token/entity/token.entity';
import {SmsService} from './services/sms.service';
import {IPFSService} from './services/IPFS.service';
import {PinataModule} from './NFT/pinta/pinta.module';
import {StoriesModule} from './Social/Story/stories/stories.module';
import {PostsModule} from './Social/Post/posts/posts.module';
import {Story} from './Social/Story/stories/entity/stories.entity';
import {Comment} from './Social/Comment/comment/entity/comment.entity';
import {Reply} from './Social/Comment/replyComment/entity/reply.entity';
import {likeComment} from './Social/Comment/like-comment/entity/like-comment.entity';
import {Post} from './Social/Post/posts/entity/posts.entity';
import {likePost} from './Social/Post/like-post/entity/like-post.entity';
import {likeStory} from './Social/Story/like-story/entity/like-story.entity';
import {RSTModule} from './Social/Support-Ticket/RST/RST.module';
import {Club} from './Social/Club/entity/club.entity';
import {NotificationModule} from './Social/Notification/notification.module';
import {WalletModule} from './NFT/wallet/wallet.module';
import {CryptoEntity} from './NFT/Crypto/entity/crypto.entity';
import {FollowUser} from './Social/Follow/entity/follow.entity';
import {LikePostModule} from "@/Social/Post/like-post/like-post.module";
import {SavePostModule} from "@/Social/Post/save-post/save-post.module";
import {savePost} from "@/Social/Post/save-post/entity/save-post.entity";
import {LikeStoryModule} from "@/Social/Story/like-story/like-story.module";
import { Notification } from './Social/Notification/entity/notification.entity';
import { NotificationService } from './Social/Notification/notification.service';
import { HttpModule } from '@nestjs/axios';
import { MessageModule } from './Social/Message/message/message.module';
import { LikeMessageModule } from './Social/Message/like-message/like-message.module';
import { BlockUser } from './Social/Block/entity/block.entity';
import { Admin } from './User/admin/entity/admin.entity';
import { AdminModule } from './User/admin/admin.module';



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
