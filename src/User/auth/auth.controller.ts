import { SignupDto } from './dto/signup-dto';
import { Body, Controller, HttpCode, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { Public } from '@/common/decorators/public.decorator';
import { LoginDto } from './dto/login-with-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ApiResponses } from '@/utils/response.util';
import { User } from '@/User/user/entity/user.entity';
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
import { VerifyEmailDto } from './dto/verify-email.dto';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @ApiCreatedResponse({ description: 'با موفقیت ساخته شد' })
@ApiNotAcceptableResponse({ description: 'رمز یکبار مصرف اشتباه است' })
@Public()
@Post('verify/otp')
async verifyOtp(
  @Body() verifyOtpDto: VerifyOtpDto,
  @Body() verifyEmailDto: VerifyEmailDto,    
  @Req() req: Request
) {
  // Either phone or email will be available, not both.
  return this.authService.verifyWithOTP( verifyOtpDto, verifyEmailDto, req);
}

@ApiCreatedResponse({ description: 'ثبت نام با موفقیت انجام شد' })
@ApiConflictResponse({ description: 'کاربر از قبل وجود دارد' })
@Public()
@Post('signup')
async signUp(@Req() req: Request, @Body() signupDto: SignupDto) {
  return this.authService.signUpUsers(signupDto, req['userAgent'], req);
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
