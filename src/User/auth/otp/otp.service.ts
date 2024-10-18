import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { OTP } from './entity/otp.entity';
import { sendOTPSMS } from '@/common/utils/auth.utils'; // SMS utility
import * as nodemailer from 'nodemailer';

const OTP_EXPIRATION_TIME_MS = 60 * 1000; // 60 seconds

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(OTP)
    private readonly otpRepository: Repository<OTP>,
  ) {}

  private transporter = nodemailer.createTransport({
    service: 'gmail', // Use the email service you prefer
    auth: {
      user: 'your-email@example.com', // Replace with your email
      pass: 'your-email-password', // Replace with your email password or app-specific password
    },
  });

  async sendOTPToEmail(email: string): Promise<void> {
    let otp: string = this.generateOTP(); 

    const existingOTP = await this.otpRepository.findOne({
      where: { phone: email },
    });

    const mailOptions = {
      from: 'your-email@example.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`,
    };

    await this.transporter.sendMail(mailOptions);

    if (existingOTP) {
      existingOTP.otp = await bcrypt.hash(otp, 10);
      existingOTP.isVerified = false;
      existingOTP.createdAt = new Date();
      existingOTP.expirationTime = new Date(Date.now() + OTP_EXPIRATION_TIME_MS);
      await this.otpRepository.save(existingOTP);
    } else {
      const hashedOTP = await bcrypt.hash(otp, 10);
      const expirationTime = new Date(Date.now() + OTP_EXPIRATION_TIME_MS);
      const newOTP = this.otpRepository.create({
        phone: email, 
        otp: hashedOTP,
        expirationTime,
        createdAt: new Date(),
      });
      await this.otpRepository.save(newOTP);
    }
    console.log(`OTP sent to email: ${email}`);
  }

   async sendOTP(phone: string): Promise<string> {
    let otp: string;
    const existingOTP = await this.otpRepository.findOne({
      where: { phone },
    });

    otp = this.generateOTP();
    console.log(`Generated OTP for phone: ${otp}`);

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

  async verifyOTP(email_or_phone: string, otp: string): Promise<boolean> {
    const otpRecord = await this.otpRepository.findOne({
      where: { phone: email_or_phone }, 
    });
  
    if (!otpRecord) {
      console.log('No OTP record found.');
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
        .where('phone = :phone', { phone: email_or_phone })
        .execute();
    }
  
    return isValidOTP;
  }
  
  

  private generateOTP(): string {
    const otp = Math.floor(10000 + Math.random() * 90000).toString();
    return otp;
  }
}
