import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from './entity/token.entity';
import { JwtService } from '@nestjs/jwt';
import { User } from '@/User/user/entity/user.entity';
import { ApiResponses, createResponse } from '@/utils/response.util';

@Injectable()
export class TokenService {
  private readonly maxSessionsPerUser: number;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly jwtService: JwtService,
  ) {
    this.maxSessionsPerUser = 1;
  }

  async createToken(user: User): Promise<string> {

    if (user) {
      const activeTokenCount = await this.tokenRepository
        .createQueryBuilder('token')
        .where('token.userPhone = :userPhone', { userPhone: user.phone })
        .getCount();

      if (activeTokenCount >= this.maxSessionsPerUser) {
        await this.tokenRepository
          .createQueryBuilder('token')
          .delete()
          .where('userPhone = :userPhone', { userPhone: user.phone })
          .execute();
      }
    }

    const payload = {
      sub: user.phone,
      phone: user.phone,
      username: user.username,
      profilePic: user.profilePic,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    };

    const token = this.jwtService.sign(payload);

    const tokenEntity = new Token();
    tokenEntity.token = token;
    tokenEntity.createdAt = new Date();
    tokenEntity.user = user;

    await this.tokenRepository.save(tokenEntity);

    return token;
  }

  async deleteToken(token: string): Promise<void> {
    await this.tokenRepository.delete({ token });
  }

  async validateToken(token: string): Promise<boolean> {
    const tokenEntity = await this.tokenRepository.findOne({
      where: { token },
    });
    return !!tokenEntity;
  }

  async getMaxSessionsPerUser(): Promise<number> {
    return this.maxSessionsPerUser;
  }

  async getTokensByPhone(phone: string): Promise<ApiResponses<Token[]>> {
    const user = await this.userRepository.findOneBy({
      phone: phone,
    });

    if (!user) {
      throw new NotFoundException('کاربر پیدا نشد!');
    }
    const tokens = await this.tokenRepository.find();

    return createResponse(200, tokens);
  }
}
