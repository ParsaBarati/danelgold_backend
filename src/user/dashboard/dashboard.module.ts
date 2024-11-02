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
import {Notification} from "@/social/notification/entity/notification.entity";
import {BlockUser} from '@/social/block/entity/block.entity';
import {Token} from '@/user/auth/token/entity/token.entity';
import {OtpModule} from '@/user/auth/otp/otp.module';
import {TokenModule} from '@/user/auth/token/token.module';
import {JwtStrategy} from '@/user/auth/strategy/jwt.strategy';
import {JwtAuthGuard} from '@/user/auth/guards/jwt.guard';
import {OtpService} from '@/user/auth/otp/otp.service';
import {RolesGuard} from '@/user/auth/guards/roles.guard';
import {TokenService} from '@/user/auth/token/token.service';
import {JwtService} from '@nestjs/jwt';
import {DashboardService} from "@/user/dashboard/dashboard.service";
import {DashboardController} from "@/user/dashboard/dashboard.controller";
import {Admin} from "@/user/admin/entity/admin.entity";
import {Message} from "@/social/message/message/entity/message.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            Admin,
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
            Notification,
            Message,
        ]),
        PassportModule,
        UserModule,
        OtpModule,
        TokenModule,
        ConfigModule,
    ],
    controllers: [DashboardController],
    providers: [
        JwtStrategy,
        JwtService,
        JwtAuthGuard,
        DashboardService,
        UserService,
        OtpService,
        TokenService,
        RolesGuard,
        UserDetailService,
        SmsService,
        PaginationService,
        NotificationService,
    ],
    exports: [JwtStrategy, PassportModule],
})
export class DashboardModule {
}
