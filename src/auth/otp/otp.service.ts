import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { generateNumericOTP } from '@/common/utils/otp.utils';
import { sendOTPSMS } from '@/common/utils/auth.utils';
import { OTP } from './entity/otp.entity';

const OTP_EXPIRATION_TIME_MS = 60 * 1000; // 60 seconds

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(OTP)
    private readonly otpRepository: Repository<OTP>,
  ) {}

  async sendOTP(phone: string): Promise<string> {
    let otp: string;

    const existingOTP = await this.otpRepository.findOne({
      where: { phone },
    });

    otp = generateNumericOTP(5).toString();
    console.log(`Generated OTP: ${otp}`);
    await sendOTPSMS(phone, otp);

    if (existingOTP) {
      existingOTP.otp = await bcrypt.hash(otp, 10);
      existingOTP.isVerified = false;
      existingOTP.createdAt = new Date();
      existingOTP.expirationTime = new Date(
        Date.now() + OTP_EXPIRATION_TIME_MS,
      );

      await this.otpRepository.save(existingOTP);
    } else {
      const hashedOTP = await bcrypt.hash(otp, 10);
      const expirationTime = new Date(Date.now() + OTP_EXPIRATION_TIME_MS);
      const newOTP = this.otpRepository.create({
        phone,
        otp: hashedOTP,
        expirationTime,
        createdAt: new Date(),
      });

      await this.otpRepository.save(newOTP);
    }

    return otp;
  }

  async verifyOTP(phone: string, otp: string): Promise<boolean> {
    const otpRecord = await this.otpRepository.findOne({ where: { phone } });

    if (!otpRecord) {
      console.log('No OTP record found for the phone.');
      return false;
    }

    const currentTime = Date.now();
    const otpTimestamp = otpRecord.createdAt.getTime();
    const otpExpirationTime = OTP_EXPIRATION_TIME_MS;

    if (currentTime - otpTimestamp > otpExpirationTime) {
      console.log('OTP has expired.');
      throw new BadRequestException('زمان رمز یکبار مصرف منقضی شده است');
    }

    const isValidOTP = await bcrypt.compare(otp, otpRecord.otp);
    console.log(`isValidOTP VERIFY: ${isValidOTP}`);
    if (isValidOTP) {
      await this.otpRepository
        .createQueryBuilder()
        .update(OTP)
        .set({ isVerified: true })
        .where('phone = :phone', { phone })
        .execute();
    }

    return isValidOTP;
  }
}
