import { TokenService } from '@/auth/token/token.service';
import { Controller, Get, Param } from '@nestjs/common';
import { PhoneDto } from '@/auth/dto/login-with-otp.dto';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}
  @Get(':phone')
  async getTokensByPhone(@Param(':phone') phone: string) {
    return this.tokenService.getTokensByPhone(phone);
  }
}
