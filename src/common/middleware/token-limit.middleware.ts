import {
  Injectable,
  NestMiddleware,
  NotAcceptableException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TokenService } from '@/auth/token/token.service';
import { User } from '@/user/entity/user.entity';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly tokenService: TokenService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
      throw new NotAcceptableException('Token is required');
    }

    const isValid = await this.tokenService.validateToken(token);

    if (!isValid) {
      throw new NotAcceptableException('Invalid or expired token');
    }

    await this.tokenService.createToken(req.user as User);

    next();
  }
}
