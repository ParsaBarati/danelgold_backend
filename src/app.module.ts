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
import { AuthModule } from './User/auth/auth.module';
import { OtpModule } from './User/auth/otp/otp.module';
import { JwtAuthGuard } from './User/auth/guards/jwt.guard';
import { RolesGuard } from './User/auth/guards/roles.guard';
import { JwtStrategy } from './User/auth/strategy/jwt.strategy';
import { TokenModule } from './User/auth/token/token.module';
import { UserModule } from './User/user/user.module';
import { SessionModule } from './session/session.module';
import { SubscribeModule } from './User/subscribe/subscribe.module';
import { UserDetailModule } from './User/user-detail/userDetail.module';
import { UploadModule } from './upload/upload.module';
import { LoggingInterceptor } from './common/utils/logger.interseptor';
import { AllExceptionsFilter } from './common/exeptionFilters/global.error';
import { UserAgentMiddleware } from './common/middleware/user-agent.middleware';
import { AuctionModule } from './Market/auction/auction.module';
import { CollectionEntityModule } from './Market/collection/collection.module';
import { NFTModule } from './NFT/nft/nft.module';
import { ForumModule } from './Social/forum/forum.module';
import { SupportTicketModule } from './Social/support-ticket/support-ticket.module';
import { UserService } from './User/user/user.service';
import { User } from './User/user/entity/user.entity';
import { Token } from './User/auth/token/entity/token.entity';
import { SmsService } from './services/sms.service';
import { IPFSService } from './services/IPFS.service';
import { PinataModule } from './NFT/pinta/pinta.module';
import { StoriesModule } from './Social/Story/stories/stories.module';
import { PostsModule } from './Social/Post/posts/posts.module';
import { Story } from './Social/Story/stories/entity/stories.entity';
import { Comment } from './Social/Comment/comment/entity/comment.entity';
import { Reply } from './Social/reply/entity/reply.entity';
import { likeComment } from './Social/Comment/like-comment/entity/like-comment.entity';
import { Post } from './Social/Post/posts/entity/posts.entity';
import { likePost } from './Social/Post/like-post/entity/like-post.entity';
import { likeStory } from './Social/Story/like-story/entity/like-story.entity';


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
      Token,
      Story,
      Comment,
      likeComment,
      Reply,
      Post,
      likePost,
      likeStory
    ]),
    AuctionModule,
    CollectionEntityModule,
    NFTModule,
    ForumModule,
    SupportTicketModule,
    AuthModule,
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
  ],
  controllers: [AppController,],
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
