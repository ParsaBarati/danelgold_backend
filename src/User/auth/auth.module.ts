import { AuthController } from './auth.controller';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { UserService } from '@/user/user.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { OtpService } from './otp/otp.service';
import { UserModule } from '@/user/user.module';
import { OtpModule } from './otp/otp.module';
import { UserDetailService } from '@/user-detail/userDetail.service';
import { TokenModule } from './token/token.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/user/entity/user.entity';
import { UserDetail } from '@/user-detail/entity/userDetail.entity';
import { Token } from './token/entity/token.entity';
import { SmsService } from '@/services/sms.service';
import { PaginationService } from '@/common/paginate/pagitnate.service';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User,UserDetail,Token]),
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
