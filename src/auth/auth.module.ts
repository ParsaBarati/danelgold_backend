import { AuthController } from './auth.controller';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { UserService } from '@/user/user.service';
import { JalaliService } from '@/utils/jalali.util';
import { JwtStrategy } from './strategy/jwt.strategy';
import { OtpService } from './otp/otp.service';
import { UserModule } from '@/user/user.module';
import { OtpModule } from './otp/otp.module';
import { CaptchaMiddleware } from '@/common/middleware/captcha.middleware';
import { UserDetailService } from '@/user-detail/userDetail.service';
import { TokenService } from './token/token.service';
import { TokenModule } from './token/token.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/user/entity/user.entity';
import { UserDetail } from '@/user-detail/entity/userDetail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserDetail]),
    PassportModule,
    UserModule,
    OtpModule,
    TokenModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    JalaliService,

    OtpService,
    OtpService,
    UserDetailService,
  ],
})
export class AuthModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(CaptchaMiddleware)
  //     .forRoutes({ path: 'auth/login/password', method: RequestMethod.POST });
  // }
}
