import { SignupDto } from './dto/signup-dto';
import { BadRequestException, Body, Controller, HttpCode, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { Public } from '@/common/decorators/public.decorator';
import { LoginDto } from './dto/login-with-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ApiResponses } from '@/utils/response.util';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TokenService } from './token/token.service';
import { OtpService } from './otp/otp.service';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
    private readonly tokenService: TokenService,
  ) {}

  @ApiCreatedResponse({ description: 'Verification code sent' })
  @ApiConflictResponse({ description: 'Invalid email or phone number' })
  @Public()
  @Post('request-code')
  async requestVerificationCode(
    @Body() { email_or_phone }: { email_or_phone: string }
  ) {
    const isPhone = /^[0-9]+$/.test(email_or_phone); 
    const isEmail = /\S+@\S+\.\S+/.test(email_or_phone); 
  
    if (isPhone) {
      await this.authService.sendOTPToPhoneOrEmail(email_or_phone, ''); // Pass empty string for email
    } else if (isEmail) {
      await this.authService.sendOTPToPhoneOrEmail('', email_or_phone); // Pass empty string for phone
    } else {
      throw new BadRequestException('Invalid email or phone number');
    }
  }  

  async verifyOtp(email_or_phone: string, verification_code: string): Promise<boolean> {
    const isPhone = /^[0-9]+$/.test(email_or_phone);
    const isEmail = /\S+@\S+\.\S+/.test(email_or_phone);
  
    if (isPhone) {
      return await this.otpService.verifyOTP(email_or_phone, verification_code);
    } else if (isEmail) {
      return await this.otpService.verifyOTPToEmail(email_or_phone, verification_code);
    } else {
      throw new BadRequestException('Invalid email or phone number');
    }
  }
  

  @ApiCreatedResponse({ description: 'Password set successfully' })
@ApiConflictResponse({ description: 'Passwords do not match' })
@Public()
@Post('set-password')
async setPassword(
  @Body() { password, confirm_password, email_or_phone }: { password: string; confirm_password: string; email_or_phone: string }
) {
  if (password !== confirm_password) {
    throw new BadRequestException('Passwords do not match');
  }

  // Call the setPassword service function
  await this.authService.setPassword(password, email_or_phone);

  return {
    status: 'success',
    message: 'Password set successfully',
  };
}


  @ApiOkResponse({ description: 'ok' })
  @ApiNotFoundResponse({ description: 'کاربر یافت نشد' })
  @ApiNotAcceptableResponse({ description: 'رمز عبور اشتباه است' })
  @Public()
  @Post('login/password')
  @HttpCode(200)
  async loginUserWithPassword(
    @Body() phoneDTO: LoginDto,
    @Req() req: Request,
  ): Promise<ApiResponses<{ token: string; username: string }>> {
    return this.authService.loginUserWithPassword(phoneDTO, req);
  }

  @Public()
  @Post('forgot-password/otp')
  async forgetPasswordWithOTP(
    @Body() phone: string,
    @Body() email: string,
  ){
    return this.authService.forgetPasswordWithOTP(phone);
  }

  @Public()
  @Post('reset-password/otp')
  async resetPasswordWithOTP(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<ApiResponses<{ login: boolean }>> {
    return this.authService.resetPasswordWithOTP(resetPasswordDto);
  }

  @Post('logout')
  async logout(@Req() req: any) {
    const token = req.headers.authorization.split(' ')[1];
    await this.tokenService.deleteToken(token);
  }
}
