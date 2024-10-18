import { Injectable, NotFoundException, NotAcceptableException, BadRequestException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Request } from 'express';
import { ApiResponses, createResponse } from '@/utils/response.util';
import { UserService } from '@/User/user/user.service';
import { UserDetailService } from '@/User/user-detail/userDetail.service';
import { OtpService } from './otp/otp.service';
import { TokenService } from './token/token.service';
import { User } from '@/User/user/entity/user.entity';
import { UserDetail } from '@/User/user-detail/entity/userDetail.entity';
import { SignupDto } from './dto/signup-dto';
import { LoginDto } from './dto/login-with-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { getUserBrowser, getUserIP, getUserOS, getBrowserVersion, getVersionPlatform } from '@/common/utils/user-agent.util';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly otpService: OtpService,
    @InjectRepository(UserDetail)
    private readonly userDetailRepository: Repository<UserDetail>,
    private readonly userDetailService: UserDetailService,
    private readonly tokenService: TokenService,
  ) {}

  async checkUserNameAvailability(userName: string): Promise<any> {
    const existingUserName = await this.userRepository.findOne({ where: { userName } });
    if (existingUserName) {
      throw new BadRequestException('Username is already taken');
    }
  }

  checkPasswordMatch(password: string, confirmPassword: string){
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
  }

  async checkUserExists(phone: string, email: string): Promise<void> {
    const existingUser = await this.userRepository.findOne({
      where: [{ phone }, { email }],
    });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
  }

  async setPassword(password: string, email_or_phone: string): Promise<void> {

    if (password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters long');
    }
  
    const hashedPassword = await this.hashPassword(password);
  
    const isPhone = /^[0-9]+$/.test(email_or_phone); 
    const isEmail = /\S+@\S+\.\S+/.test(email_or_phone); 
  
    let user;
    if (isPhone) {
      user = await this.userRepository.findOne({ where: { phone: email_or_phone } });
    } else if (isEmail) {
      user = await this.userRepository.findOne({ where: { email: email_or_phone } });
    } else {
      throw new BadRequestException('Invalid phone number or email');
    }
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    user.password = hashedPassword;
  
    await this.userRepository.save(user);
  
    return;
  }
  

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async sendOTPToPhoneOrEmail(phone: string, email: string): Promise<void> {
    if (phone) {
      await this.otpService.sendOTP(phone); 
    } else if (email) {
      await this.otpService.sendOTPToEmail(email); 
    } else {
      throw new BadRequestException('No phone or email provided');
    }
  }

  async signUpUsers(signupDto: SignupDto, userAgent: any, req: Request) {
    const { userName, password, confirmPassword, phone, email } = signupDto;
  
    await this.checkUserNameAvailability(userName);  
    this.checkPasswordMatch(password, confirmPassword); 
    await this.checkUserExists(phone, email);

    const hashedPassword = await this.hashPassword(password); 

    const newUser = await this.userService.signupUser({
      userName,
      phone,
      email,
      password: hashedPassword,
      confirmPassword,
    });

    await this.sendOTPToPhoneOrEmail(phone, email);

    return createResponse(HttpStatus.OK, {
      message: 'OTP sent to verify your phone or email',
      register: false,
    });
  }

  async verifyWithOTP(verifyOtpDto: VerifyOtpDto, verifyEmailDto: VerifyEmailDto, req: Request) {
    const { phone, email, otp } = { ...verifyOtpDto, ...verifyEmailDto };

    const isValidOTP = phone
      ? await this.otpService.verifyOTP(phone, otp) 
      : await this.otpService.verifyOTPToEmail(email, otp);

    if (!isValidOTP) {
      throw new NotAcceptableException('Invalid OTP');
    }

    const user = await this.userRepository.findOne({
      where: [{ phone }, { email }],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isVerified = true;
    await this.userRepository.save(user);

    const token = await this.tokenService.createToken(user);

    return createResponse(HttpStatus.OK, {
      message: 'Signup completed successfully',
      token,
      register: true,
    });
  }

  // Step 8: Login user with password
  async loginUserWithPassword(loginDto: LoginDto, req: Request): Promise<ApiResponses<{ token: string; username: string }>> {
    const { phone, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { phone } });

    if (!user) {
      throw new NotFoundException('کاربر یافت نشد');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new NotAcceptableException('رمز عبور اشتباه است');
    }

    user.lastLogin = new Date();
    await this.userService.updateUser(user.phone, {
      phone: user.phone,
      profilePic: user.profilePic,
    });

    // Capture user agent details
    const userAgent = {
      platform: await getUserOS(req),
      browser: await getUserBrowser(req),
      versionBrowser: await getBrowserVersion(req),
      versionPlatform: await getVersionPlatform(req),
      ip: await getUserIP(req),
    };

    // Store user agent details
    await this.userDetailService.createUserDetail(user.phone, userAgent);

    // Generate JWT token
    const token = await this.tokenService.createToken(user);

    return createResponse(200, {
      token,
      username: user.userName,
    });
  }

  // Step 9: Forget password with OTP
  async forgetPasswordWithOTP(phone?: string, email?: string) {
    const existingUser = await this.userRepository.findOne({
      where: [{ phone }, { email }],
    });

    if (!existingUser) {
      throw new NotFoundException('کاربری یافت نشد');
    }

    await this.otpService.sendOTP(phone || email);  // Send OTP to the phone or email
    return createResponse(200, { registered: true, login: false }, 'رمز یکبار مصرف ارسال شد');
  }

  // Step 10: Reset password with OTP
  async resetPasswordWithOTP(resetPasswordDto: ResetPasswordDto): Promise<ApiResponses<{ login: boolean }>> {
    const { phone, password, otp } = resetPasswordDto;

    const isValidOTP = await this.otpService.verifyOTP(phone, otp);
    if (!isValidOTP) {
      throw new NotAcceptableException('رمز یکبار مصرف اشتباه است');
    }

    const existingUser = await this.userRepository.findOne({ where: { phone } });
    if (!existingUser) {
      throw new NotFoundException('کاربر یافت نشد');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    existingUser.password = hashedPassword;

    // Save the updated user
    await this.userRepository.save(existingUser);

    return createResponse(200, { login: false }, 'رمز عبور با موفقیت تغییر یافت');
  }
}
