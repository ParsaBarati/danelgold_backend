// src/auth/token/token.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './entity/token.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { JwtStrategy } from '@/auth/strategy/jwt.strategy';
import { UserModule } from '@/user/user.module';
import { TokenController } from './controller.token';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Token]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  controllers: [TokenController],
  providers: [TokenService, JwtStrategy],
  exports: [TokenService],
})
export class TokenModule {}
