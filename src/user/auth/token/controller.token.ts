import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { TokenService } from '@/user/auth/token/token.service';

@ApiExcludeController()
@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}
  @Get(':phone')
  async getTokensByPhone(@Param(':phone') phone: string) {
    return this.tokenService.getTokensByPhone(phone);
  }
}
