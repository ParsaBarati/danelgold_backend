import { AuthController } from './auth.controller';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { UserService } from '@/User/user/user.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { OtpService } from './otp/otp.service';
import { UserModule } from '@/User/user/user.module';
import { OtpModule } from './otp/otp.module';
import { UserDetailService } from '@/User/user-detail/userDetail.service';
import { TokenModule } from './token/token.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/User/user/entity/user.entity';
import { UserDetail } from '@/User/user-detail/entity/userDetail.entity';
import { Token } from './token/entity/token.entity';
import { SmsService } from '@/services/sms.service';
import { PaginationService } from '@/common/paginate/pagitnate.service';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RolesGuard } from './guards/roles.guard';
import { Post } from '@/Social/Post/posts/entity/posts.entity';
import { Story } from '@/Social/Story/stories/entity/stories.entity';
import { Club } from '@/Social/Club/entity/club.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User,UserDetail,Token,Post,Story,Club]),
    PassportModule,
    UserModule,
    OtpModule,
    TokenModule,
    ConfigModule
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
    PaginationService
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
