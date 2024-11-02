import { Module } from '@nestjs/common';
import { SubscribeController } from '@/user/subscribe/subscribe.controller';
import { SubscribeService } from '@/user/subscribe/subscribe.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscribe } from '@/user/subscribe/entity/subscribe.entity';
import { User } from '@/user/user/entity/user.entity';
import { SmsService } from '@/services/sms.service';
import { Auction } from '@/market/auction/entity/auction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subscribe, User,Auction])],
  controllers: [SubscribeController],
  providers: [SubscribeService, SmsService],
})
export class SubscribeModule {}
