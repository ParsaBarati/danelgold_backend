// src/auth/token/token.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './entity/token.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { JwtStrategy } from '@/User/auth/strategy/jwt.strategy';
import { UserModule } from '@/User/user/user.module';
import { TokenController } from './controller.token';
import { User } from '@/User/user/entity/user.entity';
import { UserService } from '@/User/user/user.service';
import { SmsService } from '@/services/sms.service';
import { Post } from '@/Social/Post/posts/entity/posts.entity';
import { Story } from '@/Social/Story/stories/entity/stories.entity';
import { Club } from '@/Social/Club/entity/club.entity';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Token,User,Post,Story,Club]),
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
  providers: [TokenService, UserService,SmsService,JwtStrategy],
  exports: [TokenService],
})
export class TokenModule {}
