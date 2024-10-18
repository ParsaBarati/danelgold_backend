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
import { PhoneDto } from './dto/login-with-otp.dto';
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

  async checkUser(
    phoneDto: PhoneDto,
  ): Promise<ApiResponses<{ registered: boolean; login: boolean }>> {
    const { phone } = phoneDto;

    const user = await this.userRepository.findOneBy({ phone });
    if (!user) {
      const data = { registered: false, login: false };
      return createResponse(HttpStatus.OK, data);
    } else {
      return createResponse(HttpStatus.OK, { registered: true, login: false });
    }
  }

  async signUpUsers(signupDto: SignupDto, userAgent: any, req: Request) {
    const { phone, firstName, lastName, password, email } = signupDto;

    const existingUser = await this.userRepository.findOneBy({ phone });

    if (existingUser) {
      throw new BadRequestException('کاربر از قبل وجود دارد');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const data = {
      name: firstName,
      family: lastName,
      userName: phone,
      password,
      email
    };


    const newUser = await this.userService.singupUser({
      firstName,
      lastName,
      phone,
      password: hashedPassword,
      email,
      createdAt: new Date(),
    });

    const userDetail = this.userDetailRepository.create({
      user: newUser,
      ...userAgent,
    });

    await this.userDetailRepository.save(userDetail);

    const token = await this.tokenService.createToken(newUser);

    return createResponse(201, {
      message: 'ثبت نام با موفقیت انجام شد',
      token,
      username: newUser.phone,
      register: true,
    });
  }

  async loginWithOTP(phoneDto: PhoneDto): Promise<ApiResponses<any>> {
    const { phone } = phoneDto;
    const otp = await this.otpService.sendOTP(phone);

    return createResponse(200,otp);
  }

  async verifyWithOTP(verifyOtpDto: VerifyOtpDto, req: Request) {
    const { phone, otp } = verifyOtpDto;
    const isValidOTP = await this.otpService.verifyOTP(phone, otp);

    if (!isValidOTP) {
      throw new NotAcceptableException('رمز یکبار مصرف اشتباه است');
    }

    const user = await this.userRepository.findOneBy({ phone });

    if (!user) {
      return createResponse(
        201,
        { register: false, otp: true },
        'کاربر یافت نشد، اما رمز یکبار مصرف صحیح است',
      );
    }

    user.lastLogin = new Date();

    const updateUserDTO = {
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      roles: user.role,
      profilePic: user.profilePic,
      lastLogin: user.lastLogin,
    };
    await this.userService.updateUser(user.phone, updateUserDTO);

    const userAgentHeader = req.headers['user-agent'];

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
      username: user.phone,
      rolse: user.role,
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
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      roles: user.role,
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
      username: user.phone,
      rolse: user.role,
    });
  }

  async forgetPasswordWithOTP(phone: string) {
    const existingUser = await this.userRepository.findOneBy({ phone });
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
