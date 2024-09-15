import { Module } from '@nestjs/common';
import { SubscribeController } from './subscribe.controller';
import { SubscribeService } from './subscribe.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscribe } from './entity/subscribe.entity';
import { User } from '@/user/entity/user.entity';
import { SmsService } from '@/services/sms.service';
import { Auction } from '@/auction/entity/auction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subscribe, User,Auction])],
  controllers: [SubscribeController],
  providers: [SubscribeService, SmsService],
})
export class SubscribeModule {}
