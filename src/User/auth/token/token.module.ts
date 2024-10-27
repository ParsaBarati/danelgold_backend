// src/auth/token/token.module.ts

import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Token} from './entity/token.entity';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {JwtModule} from '@nestjs/jwt';
import {TokenService} from './token.service';
import {JwtStrategy} from '@/User/auth/strategy/jwt.strategy';
import {UserModule} from '@/User/user/user.module';
import {TokenController} from './controller.token';
import {User} from '@/User/user/entity/user.entity';
import {UserService} from '@/User/user/user.service';
import {SmsService} from '@/services/sms.service';
import {Post} from '@/Social/Post/posts/entity/posts.entity';
import {Story} from '@/Social/Story/stories/entity/stories.entity';
import {Club} from '@/Social/Club/entity/club.entity';
import {likePost} from "@/Social/Post/like-post/entity/like-post.entity";
import {savePost} from "@/Social/Post/save-post/entity/save-post.entity";
import {FollowUser} from "@/Social/Follow/entity/follow.entity";
import {likeStory} from "@/Social/Story/like-story/entity/like-story.entity";
import {Notification} from "@/Social/Notification/entity/notification.entity";
import {HttpModule} from "@nestjs/axios";
import {NotificationService} from "@/Social/Notification/notification.service";
import { BlockUser } from '@/Social/Block/entity/block.entity';

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
                secret: configService.get<string>('JWT_SECRET'),
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
