import { Module } from '@nestjs/common';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OTP } from './entity/otp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OTP])],
  controllers: [OtpController],
  providers: [OtpService],
  exports: [OtpService, TypeOrmModule],
})
export class OtpModule {}
