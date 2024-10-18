import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { OTP } from './entity/otp.entity';
import { sendOTPSMS } from '@/common/utils/auth.utils'; // SMS utility

const OTP_EXPIRATION_TIME_MS = 60 * 1000; // 60 seconds

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(OTP)
    private readonly otpRepository: Repository<OTP>,
  ) {}

  // Method for sending OTP to a phone number
  async sendOTP(phone: string): Promise<string> {
    let otp: string;

    const existingOTP = await this.otpRepository.findOne({
      where: { phone },
    });

    otp = this.generateOTP(); // Generate OTP
    console.log(`Generated OTP for phone: ${otp}`);

    await sendOTPSMS(phone, otp); // Send OTP via SMS (implement this)

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

  // Method for sending OTP to an email
  async sendOTPToEmail(email: string): Promise<string> {
    let otp: string;

    const existingOTP = await this.otpRepository.findOne({
      where: { phone: email }, // You can choose to store emails separately in a new table or handle this accordingly
    });

    otp = this.generateOTP(); // Generate OTP
    console.log(`Generated OTP for email: ${otp}`);

    await this.sendOTPToEmail(email); // Send OTP via email (implement this)

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
        phone: email, // Store email here (can be a different column or entity if needed)
        otp: hashedOTP,
        expirationTime,
        createdAt: new Date(),
      });
      await this.otpRepository.save(newOTP);
    }

    return otp;
  }

  // Method for verifying OTP for phone number
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

  // Method for verifying OTP for email
  async verifyOTPToEmail(email: string, otp: string): Promise<boolean> {
    const otpRecord = await this.otpRepository.findOne({ where: { phone: email } });

    if (!otpRecord) {
      console.log('No OTP record found for the email.');
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
        .where('phone = :phone', { phone: email })
        .execute();
    }

    return isValidOTP;
  }

  // Method for generating OTP
  private generateOTP(): string {
    const otp = Math.floor(10000 + Math.random() * 90000).toString();
    return otp;
  }
}
