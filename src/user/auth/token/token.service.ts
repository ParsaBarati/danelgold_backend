import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '@/user/user/entity/user.entity';
import { ApiResponses, createResponse } from '@/utils/response.util';
import { Admin } from '@/user/admin/entity/admin.entity';
import { Token } from '@/user/auth/token/entity/token.entity';

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
        .where('token.user = :userId', { userId: user.id })
        .getCount();

      if (activeTokenCount >= this.maxSessionsPerUser) {
        await this.tokenRepository
          .createQueryBuilder('token')
          .delete()
          .where('user = :userId', { userId: user.id })
          .execute();
      }
    }

    const payload = {
      sub: user.id,
      phone: user.phone,
      email: user.email,
      username: user.username,
      profilePic: user.profilePic,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    };

    const token = this.jwtService.sign(payload);

    const tokenEntity = new Token();
    tokenEntity.token = token;
    tokenEntity.createdAt = new Date();
    tokenEntity.user = user; // Correctly assign user relation

    await this.tokenRepository.save(tokenEntity);

    return token;
  }
  async createTokenForAdmin(admin: Admin): Promise<string> {
    if (admin) {
      const activeTokenCount = await this.tokenRepository
        .createQueryBuilder('token')
        .where('token.admin = :adminId', { adminId: admin.id })
        .getCount();

      if (activeTokenCount >= this.maxSessionsPerUser) {
        await this.tokenRepository
          .createQueryBuilder('token')
          .delete()
          .where('admin = :adminId', { adminId: admin.id })
          .execute();
      }
    }

    const payload = {
      sub: admin.id,
      email: admin.email,
      username: admin.username,
      profilePic: admin.profilePic,
      createdAt: admin.createdAt,
      lastLogin: admin.lastLogin,
    };

    const token = this.jwtService.sign(payload,{
      secret: process.env.JWT_SECRET,
    });

    const tokenEntity = new Token();
    tokenEntity.token = token;
    tokenEntity.createdAt = new Date();
    tokenEntity.admin = admin; // Correctly assign user relation

    await this.tokenRepository.save(tokenEntity);

    return token;
  }

  async deleteToken(token: string): Promise<void> {
    await this.tokenRepository.delete({ token });
  }

  async validateToken(token: string): Promise<boolean> {
    console.log(token)
    const tokenEntity = await this.tokenRepository.findOne({
      where: { token },
    });
    console.log('validate is here',tokenEntity);
    return !!tokenEntity;
  }

  async getByToken(token: string): Promise<User | Admin | null> {
    const tokenEntity = await this.tokenRepository.findOne({
        where: { token },
        relations: ['user', 'admin'], // Include both relations
    });

    if (!tokenEntity) {
        return null;
    }

    if (tokenEntity.admin) {
        return tokenEntity.admin; // Return Admin if found
    }

    if (tokenEntity.user) {
        return tokenEntity.user; // Return User if found
    }

    await this.tokenRepository.delete(tokenEntity); // Clean up if neither is found
    return null;
}

  async getMaxSessionsPerUser(): Promise<number> {
    return this.maxSessionsPerUser;
  }

  async getTokensByPhone(identifier: string): Promise<ApiResponses<Token[]>> {
    const user = await this.userRepository.findOne({
      where: [{ phone: identifier }, { email: identifier }], // Search by phone or email
    });

    if (!user) {
      throw new NotFoundException('کاربر پیدا نشد!');
    }

    const tokens = await this.tokenRepository.find({
      where: { user: user },
    });

    return createResponse(200, tokens);
  }
}
