import { Module } from '@nestjs/common';
import { OtpController } from '@/user/auth/otp/otp.controller';
import { OtpService } from '@/user/auth/otp/otp.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OTP } from '@/user/auth/otp/entity/otp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OTP])],
  controllers: [OtpController],
  providers: [OtpService],
  exports: [OtpService, TypeOrmModule],
})
export class OtpModule {}
