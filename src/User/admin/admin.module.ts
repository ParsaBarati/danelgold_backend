import {Module} from '@nestjs/common';
import {PassportModule} from '@nestjs/passport';
import {UserService} from '@/User/user/user.service';
import {UserModule} from '@/User/user/user.module';
import {UserDetailService} from '@/User/user-detail/userDetail.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from '@/User/user/entity/user.entity';
import {UserDetail} from '@/User/user-detail/entity/userDetail.entity';
import {SmsService} from '@/services/sms.service';
import {PaginationService} from '@/common/paginate/pagitnate.service';
import {ConfigModule} from '@nestjs/config';
import {Post} from '@/Social/Post/posts/entity/posts.entity';
import {Story} from '@/Social/Story/stories/entity/stories.entity';
import {Club} from '@/Social/Club/entity/club.entity';
import {likePost} from "@/Social/Post/like-post/entity/like-post.entity";
import {savePost} from "@/Social/Post/save-post/entity/save-post.entity";
import {FollowUser} from "@/Social/Follow/entity/follow.entity";
import {likeStory} from "@/Social/Story/like-story/entity/like-story.entity";
import {NotificationService} from "@/Social/Notification/notification.service";
import {Notification} from "@/Social/Notification/entity/notification.entity";
import { BlockUser } from '@/Social/Block/entity/block.entity';
import { Token } from '../auth/token/entity/token.entity';
import { OtpModule } from '../auth/otp/otp.module';
import { TokenModule } from '../auth/token/token.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { JwtStrategy } from '../auth/strategy/jwt.strategy';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { OtpService } from '../auth/otp/otp.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Admin } from './entity/admin.entity';
import { TokenService } from '../auth/token/token.service';
import { JwtService } from '@nestjs/jwt';

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
            Notification
        ]),
        PassportModule,
        UserModule,
        OtpModule,
        TokenModule,
        ConfigModule,
    ],
    controllers: [AdminController],
    providers: [
        JwtStrategy,
        JwtService,
        JwtAuthGuard,
        AdminService,
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
export class AdminModule {
}
