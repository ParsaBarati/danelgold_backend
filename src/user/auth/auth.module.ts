import {Module} from '@nestjs/common';
import {PassportModule} from '@nestjs/passport';
import {UserService} from '@/user/user/user.service';
import {UserModule} from '@/user/user/user.module';
import {UserDetailService} from '@/user/user-detail/userDetail.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from '@/user/user/entity/user.entity';
import {UserDetail} from '@/user/user-detail/entity/userDetail.entity';
import {SmsService} from '@/services/sms.service';
import {PaginationService} from '@/common/paginate/pagitnate.service';
import {ConfigModule} from '@nestjs/config';
import {Post} from '@/social/post/posts/entity/posts.entity';
import {Story} from '@/social/story/stories/entity/stories.entity';
import {Club} from '@/social/club/entity/club.entity';
import {likePost} from "@/social/post/like-post/entity/like-post.entity";
import {savePost} from "@/social/post/save-post/entity/save-post.entity";
import {FollowUser} from "@/social/follow/entity/follow.entity";
import {likeStory} from "@/social/story/like-story/entity/like-story.entity";
import {NotificationService} from "@/social/notification/notification.service";
import {HttpModule} from "@nestjs/axios";
import {Notification} from "@/social/notification/entity/notification.entity";
import {NotificationModule} from "@/social/notification/notification.module";
import { BlockUser } from '@/social/block/entity/block.entity';
import { Token } from './token/entity/token.entity';
import { OtpModule } from './otp/otp.module';
import { TokenModule } from './token/token.module';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './guards/jwt.guard';
import { AuthService } from './auth.service';
import { RolesGuard } from './guards/roles.guard';
import { JwtStrategy } from './strategy/jwt.strategy';
import { OtpService } from './otp/otp.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User, 
            UserDetail, 
            Token, 
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
        PassportModule,
        UserModule,
        OtpModule,
        TokenModule,
        ConfigModule,
    ],
    controllers: [AuthController],
    providers: [
        JwtStrategy,
        JwtAuthGuard,
        AuthService,
        UserService,
        OtpService,
        RolesGuard,
        UserDetailService,
        SmsService,
        PaginationService,
        NotificationService,
    ],
    exports: [JwtStrategy, PassportModule],
})
export class AuthModule {
}
