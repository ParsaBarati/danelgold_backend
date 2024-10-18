import { UserDetailService } from '@/User/user-detail/userDetail.service';
import {
  Injectable,
  NotFoundException,
  HttpStatus,
  NotAcceptableException,
  BadRequestException,
} from '@nestjs/common';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import * as bcrypt from 'bcryptjs';
import { ApiResponses, createResponse } from '@/utils/response.util';
import { OtpService } from './otp/otp.service';
import { SignupDto } from './dto/signup-dto';
import { LoginDto } from './dto/login-with-password.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Request } from 'express';
import { TokenService } from './token/token.service';
import { User } from '@/User/user/entity/user.entity';
import { UserService } from '@/User/user/user.service';
import { UserDetail } from '@/User/user-detail/entity/userDetail.entity';
import { 
  getBrowserVersion, 
  getUserBrowser, 
  getUserIP, 
  getUserOS, 
  getVersionPlatform 
} from '@/common/utils/user-agent.util';
import { VerifyEmailDto } from './dto/verify-email.dto';

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


  async signUpUsers(signupDto: SignupDto, userAgent: any, req: Request) {
    const { userName, password, confirmPassword, phone, email } = signupDto;
  
    // Step 1: Check if the userName is already taken
    const existingUserName = await this.userRepository.findOne({ where: { userName } });
    if (existingUserName) {
      throw new BadRequestException('Username is already taken');
    }
  
    // Step 2: Check if passwords match
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
  
    // Step 3: Check if the user already exists by phone or email
    const existingUser = await this.userRepository.findOne({
      where: [{ phone }, { email }],
    });
  
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
  
    // Step 4: Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // Step 5: Create user entity
    const newUser = await this.userService.signupUser({
      userName,
      phone,
      email,
      password: hashedPassword,
      confirmPassword
    });
  
    // Step 6: Send OTP for phone or email verification
    if (phone) {
      await this.otpService.sendOTP(phone); // Send OTP for phone verification
    } else if (email) {
      await this.otpService.sendOTPToEmail(email); // Send OTP for email verification
    }
  
    // Step 7: Return response indicating that OTP is sent
    return createResponse(HttpStatus.OK, {
      message: 'OTP sent to verify your phone or email',
      register: false, // Registration is not completed yet
    });
  }
  
  async verifyWithOTP(
    verifyOtpDto: VerifyOtpDto,
    verifyEmailDto: VerifyEmailDto, 
    req: Request
  ) {
    const { phone, email, otp } = { ...verifyOtpDto, ...verifyEmailDto };
  
    // Step 1: Validate OTP (either for phone or email)
    const isValidOTP = phone
      ? await this.otpService.verifyOTP(phone, otp) // Verify OTP for phone
      : await this.otpService.verifyOTPToEmail(email, otp); // Verify OTP for email
  
    if (!isValidOTP) {
      throw new NotAcceptableException('Invalid OTP');
    }
  
    // Step 2: Find the user based on phone or email
    const user = await this.userRepository.findOne({
      where: [{ phone }, { email }],
    });
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    // Step 3: Mark the user as verified
    user.isVerified = true;
    await this.userRepository.save(user);
  
    // Step 4: Generate a JWT token
    const token = await this.tokenService.createToken(user);
  
    // Step 5: Return response with success message and token
    return createResponse(HttpStatus.OK, {
      message: 'Signup completed successfully',
      token,
      register: true,
    });
  }
  
  
  async loginUserWithPassword(
    loginDto: LoginDto,
    req: Request,
  ): Promise<ApiResponses<{ token: string; username: string }>> {
    const { phone, password } = loginDto;
    const user = await this.userRepository.findOneBy({ phone });

    if (!user) {
      throw new NotFoundException('کاربر یافت نشد');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new NotAcceptableException('رمز عبور اشتباه است');
    }

    user.lastLogin = new Date();
    const updateUserDTO = {
      phone: user.phone,
      profilePic: user.profilePic,
      lastLogin: user.lastLogin,
    };
    await this.userService.updateUser(user.phone, updateUserDTO);

    const userAgent = {
      platform: await getUserOS(req),
      browser: await getUserBrowser(req),
      versionBrowser: await getBrowserVersion(req),
      versionPlatform: await getVersionPlatform(req),
      ip: await getUserIP(req),
    };

    await this.userDetailService.createUserDetail(user.phone, userAgent);

    const token = await this.tokenService.createToken(user);
    return createResponse(200, {
      token,
      username: user.userName,
    });
  }

  async forgetPasswordWithOTP(phone?: string,email?: string) {
    const existingUser = await this.userRepository.findOne({ 
      where: [{phone},{email}] 
    });
    if (!existingUser) {
      throw new NotFoundException('کاربری یافت نشد');
    }
    await this.otpService.sendOTP(phone);
    return createResponse(
      200,
      { registred: true, login: false },
      'رمز یکبار مصرف ارسال شد',
    );
  }

  async resetPasswordWithOTP(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<ApiResponses<{ login: boolean }>> {
    const { phone, password, otp } = resetPasswordDto;

    const isValidOTP = await this.otpService.verifyOTP(phone, otp);

    if (!isValidOTP) {
      throw new NotAcceptableException('رمز یکبار مصرف اشتباه است');
    }

    const existingUser = await this.userRepository.findOneBy({ phone });

    if (!existingUser) {
      throw new NotFoundException('کاربر یافت نشد');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    existingUser.password = hashedPassword;

    await this.userRepository.save(existingUser);
    return createResponse(
      200,
      { login: false },
      'رمز عبور با موفقیت تغییر یافت',
    );
  }
}
