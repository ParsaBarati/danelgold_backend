// src/auth/token/token.module.ts

import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {JwtModule} from '@nestjs/jwt';
import {TokenService} from '@/user/auth/token/token.service';
import {UserModule} from '@/user/user/user.module';
import {User} from '@/user/user/entity/user.entity';
import {UserService} from '@/user/user/user.service';
import {SmsService} from '@/services/sms.service';
import {Post} from '@/social/post/posts/entity/posts.entity';
import {Story} from '@/social/story/stories/entity/stories.entity';
import {Club} from '@/social/club/entity/club.entity';
import {likePost} from "@/social/post/like-post/entity/like-post.entity";
import {savePost} from "@/social/post/save-post/entity/save-post.entity";
import {FollowUser} from "@/social/follow/entity/follow.entity";
import {likeStory} from "@/social/story/like-story/entity/like-story.entity";
import {Notification} from "@/social/notification/entity/notification.entity";
import {HttpModule} from "@nestjs/axios";
import {NotificationService} from "@/social/notification/notification.service";
import { BlockUser } from '@/social/block/entity/block.entity';
import { Token } from '@/user/auth/token/entity/token.entity';
import { TokenController } from '@/user/auth/token/controller.token';
import { JwtStrategy } from '@/user/auth/strategy/jwt.strategy';

@Module({
    imports: [
        UserModule,
        TypeOrmModule.forFeature([
            Token, 
            User, 
            Post, 
            Story, 
            Club, 
            likePost, 
            savePost, 
            FollowUser,
            BlockUser, 
            likeStory, 
            Notification
        ]),
        ConfigModule,

        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: process.env.JWT_SECRET,
                signOptions: {expiresIn: '7d'},
            }),
        }),
    ],
    controllers: [TokenController],
    providers: [TokenService, UserService, SmsService, JwtStrategy, NotificationService],
    exports: [TokenService],
})
export class TokenModule {
}
