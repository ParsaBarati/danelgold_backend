import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '@/common/decorators/public.decorator';
import { Observable } from 'rxjs';
import { TokenService } from '@/auth/token/token.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private tokenService: TokenService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    const isValid = await this.tokenService.validateToken(token);
    if (!isValid) {
      throw new ConflictException('Invalid token');
    }

    // Convert Observable to Promise and resolve it to boolean
    const superCanActivate = super.canActivate(context);
    if (superCanActivate instanceof Observable) {
      return superCanActivate.toPromise().then((result) => !!result);
    }
    return superCanActivate as boolean;
  }
}
